using ErrorOr;
using Microsoft.AspNetCore.Mvc;
using TemplateManager_Backend.Models;
using TemplateManager_Backend.Services;

namespace TemplateManager_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplateController(TemplateServices _templateServices, IUserClaimsMapper<User> userClaimsMapper) : ControllerBase
    {
        private ErrorOr<string> GetUserIdFromToken()
        {
            var token = HttpContext.Request.Cookies[CookieKeys.Token];
            if (string.IsNullOrEmpty(token))
                return Error.Unauthorized("Token not found");

            var user = userClaimsMapper.FromClaims(token);
            if (string.IsNullOrEmpty(user.Id))
                return Error.Unauthorized("User ID claim not found");

            return user.Id;
        }

        [HttpPost("Create")]
        public IActionResult CreateTemplate([FromBody] TemplateRequest request)
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);

            if (request == null)
            {
                return BadRequest("There is no information for template");
            }
            try
            {
                return Ok(_templateServices.CreateTemplate(currentUserId.Value, request));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + "Something went wrong.");
            }
        }

        [HttpGet]
        public IActionResult  GetTemplates()
        {
            var currentUserId = GetUserIdFromToken();
            if (currentUserId.IsError)
                return Unauthorized(currentUserId.FirstError.Code);
            try
            {
                return Ok(_templateServices.GetTemplates(currentUserId.Value));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("Change/{id}")]
        public IActionResult UpdateTemplate([FromRoute]string id, [FromBody] TemplateRequest request)
        {
            if (id == null || request == null)
            {
                return BadRequest("Something is missing");
            }
            try
            {
                _templateServices.UpdateTemplate(id, request);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
            return Ok();
        }
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteTemplate([FromRoute]string id)
        {
            if (id == null) return BadRequest("There is no such template");
            try
            {
        _templateServices.DeleteTemplate(id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
            return Ok();
        }

        [HttpPost("{id}/GeneratePdf")]
        public async Task<IActionResult> GeneratePdf([FromRoute]string id, [FromBody] PdfGenerateRequest request)
        {
            try
            {
                var template =  _templateServices.GetTemplateById(id);
                if (template == null) return NotFound();

                var pdfBytes = await _templateServices.GeneratePdfHtmlAsync(template.Html, request.Data);
                return File(pdfBytes, "application/pdf", $"{template.Name}.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }
    }
}
