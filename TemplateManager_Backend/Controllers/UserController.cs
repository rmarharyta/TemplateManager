using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TemplateManager_Backend.Models;
using TemplateManager_Backend.Services;

namespace TemplateManager_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(UserServices _userServices, IEncryptionService encryptionService, Services.IAuthenticationService authenticationService, IJwtService jwtService, IUserClaimsMapper<User> userClaimsMapper) : ControllerBase
    {
        private ErrorOr<string> GetUserIdFromToken()
        {
            var token = HttpContext.Request.Cookies[CookieKeys.Token];
            if (string.IsNullOrEmpty(token))
                return ErrorOr.Error.Unauthorized("Token not found");

            var user = userClaimsMapper.FromClaims(token);
            if (string.IsNullOrEmpty(user.Id))
                return ErrorOr.Error.Unauthorized("User ID claim not found");

            return user.Id;
        }
        //Register
        [HttpPost("Register")]
        public IActionResult RegistrationUser([FromBody] RegisterLoginRequest request)
        {
            if (request == null)
            {
                return BadRequest("User data is required.");
            }
            try
            {
                var returnedUserId = _userServices.Registration(request);
                var user = new User
                {
                    Id = returnedUserId
                };
                var tokenExpiration = DateTime.UtcNow.Add(AuthenticationSettings.TokenExpiration);

                string token = jwtService.GenerateToken(user, tokenExpiration);
                string refreshToken = encryptionService.Encrypt(encryptionService.SecretKeys.RefreshTokenEncryptionSecretKey, returnedUserId);

                authenticationService.SetAuthCookies(HttpContext, token, refreshToken);

                return CreatedAtAction(nameof(RegistrationUser), new { returnedUserId });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + "Something went wrong.");
            }
        }

        [HttpPost("Login")]
        public IActionResult LoginUser([FromBody] RegisterLoginRequest request)
        {
            if (request == null)
            {
                return BadRequest("User data is required.");
            }
            try
            {
                var returnedUserId = _userServices.LogIn(request)
                                 ?? throw new Exception("Login is failed");

                var user = new User
                {
                    Id = returnedUserId
                };
                var tokenExpiration = DateTime.UtcNow.Add(AuthenticationSettings.TokenExpiration);

                string token = jwtService.GenerateToken(user, tokenExpiration);
                string refreshToken = encryptionService.Encrypt(encryptionService.SecretKeys.RefreshTokenEncryptionSecretKey, returnedUserId);

                authenticationService.SetAuthCookies(HttpContext, token, refreshToken);

                return Ok(new { returnedUserId });
            }
            catch (Exception ex)
            {
                return BadRequest("Problem: " + ex.Message);
            }
        }
        [Authorize]
        [HttpDelete("Delete")]
        public IActionResult DeleteUser()
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);


            try
            {
                _userServices.DeleteUser(currentUserId.Value);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Could not delete {ex.Message}");
            }
        }

        [Authorize]
        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            // Видаляємо cookie
            authenticationService.RemoveAuthCookies(HttpContext);
            return Ok();
        }

        [HttpGet]
        [Route("refresh")]
        public IActionResult RefreshToken()
        {
            string? refreshToken = HttpContext.Request.Cookies[CookieKeys.RefreshToken];
            if (refreshToken is null)
                return Unauthorized();

            string userId = encryptionService.Decrypt(encryptionService.SecretKeys.RefreshTokenEncryptionSecretKey, refreshToken);
            if (userId == null)
                return Unauthorized();

            try
            {
                var user = new User { Id = userId };
                var token = jwtService.GenerateToken(user, DateTime.UtcNow.Add(AuthenticationSettings.TokenExpiration));
                authenticationService.SetAuthCookies(HttpContext, token, refreshToken);
                return Ok();
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [HttpGet]
        [Route("2772me")]
        public IActionResult GetUser()
        {
            var user = GetUserFromToken();
            if (!user.IsError)
                return Ok(new { user.Value.Id });
            return BadRequest(new { Error = user.FirstError.Code });
        }

        private ErrorOr<User> GetUserFromToken()
        {
            var token = HttpContext.Request.Cookies[CookieKeys.Token];
            if (string.IsNullOrEmpty(token))
                return Error.Unauthorized("Token not found");

            var user = userClaimsMapper.FromClaims(token);
            if (user is not null)
                return user;

            return Error.Unauthorized("User ID claim not found");
        }
    }
}

