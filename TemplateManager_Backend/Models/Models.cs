using System.ComponentModel.DataAnnotations;

namespace TemplateManager_Backend.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
    }

    public class Template
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Html { get; set; }
        [Required]
        public string UserId { get; set; }
    }

    public class RegisterLoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class TemplateRequest
    {
        public string Name { get; set; }
        public string Html { get; set; } 
    }

    public class PdfGenerateRequest
    {
        public Dictionary<string, string> Data { get; set; } = new();
    }

}
