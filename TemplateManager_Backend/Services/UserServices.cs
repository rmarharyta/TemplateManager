using TemplateManager_Backend.Data;
using TemplateManager_Backend.Models;

namespace TemplateManager_Backend.Services
{
    //Interface for services
    public interface IUserService
    {
        string Registration(RegisterLoginRequest request);
        string? LogIn(RegisterLoginRequest request);
    }
    public class UserServices(AppDbContext _context):IUserService
    {
        public string Registration(RegisterLoginRequest request)
        {
            User user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(request.Password)
            };
            _context.Users.Add(user);
            _context.SaveChangesAsync();

            return user.Id;
        }

        public string? LogIn(RegisterLoginRequest request)
        {
            var login =  _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (login == null) return null;

            if (BCrypt.Net.BCrypt.EnhancedVerify(request.Password, login.PasswordHash))
            {
                return login.Id;
            }
            return null;
        }

    }
}
