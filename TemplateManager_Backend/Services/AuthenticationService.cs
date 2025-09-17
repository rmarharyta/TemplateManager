
namespace TemplateManager_Backend.Services
{
    public interface IAuthenticationService
    {
        void SetAuthCookies(HttpContext context, string token, string refreshToken);
        void RemoveAuthCookies(HttpContext context);
    }
    public class AuthenticationSettings
    {
        public readonly static TimeSpan TokenExpiration = TimeSpan.FromMinutes(60);
        public readonly static TimeSpan RefreshTokenExpiration = TimeSpan.FromDays(7);
    }
    public class AuthenticationService : IAuthenticationService
    {
        public void RemoveAuthCookies(HttpContext context)
        {
            context.Response.Cookies.Delete(CookieKeys.Token, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true });
            context.Response.Cookies.Delete(CookieKeys.RefreshToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.None, Secure = true });
        }

        public void SetAuthCookies(HttpContext context, string token, string refreshToken)
        {
            var tokenExpiration = DateTime.UtcNow.Add(AuthenticationSettings.TokenExpiration);
            var refreshTokenExpiration = DateTime.UtcNow.Add(AuthenticationSettings.RefreshTokenExpiration);

            context.Response.Cookies.Append(CookieKeys.Token, token, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.None, Expires = tokenExpiration, Secure = true });
            context.Response.Cookies.Append(CookieKeys.RefreshToken, refreshToken, new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.None, Expires = refreshTokenExpiration, Secure = true });
        }
    }
}