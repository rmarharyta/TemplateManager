using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TemplateManager_Backend.Models;

namespace TemplateManager_Backend.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user, DateTime expires);
    }
    public class JwtService(IOptions<SecretKeys> secretKeysOptions, IUserClaimsMapper<User> claimsMapper, IConfiguration configuration) : IJwtService
    {
        private readonly SecretKeys _secretKeys = secretKeysOptions.Value;

        public string GenerateToken(User user, DateTime expires)
        {
            var claims = claimsMapper.ToClaims(user);
            var ssk = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtConfig:Key"] ?? throw new InvalidOperationException("No JWT Key")));
            var creds = new SigningCredentials(ssk, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken
            (
                issuer: configuration["JwtConfig:Issuer"],
                audience: configuration["JwtConfig:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
    public interface IUserClaimsMapper<T>
    {
        public T FromClaims(IEnumerable<Claim> claims);
        public T FromClaims(string token);
        public IEnumerable<Claim> ToClaims(T user);
    }
    public class UserClaimsMapper(IEncryptionService encryptionService) : IUserClaimsMapper<User>
    {
        public User FromClaims(IEnumerable<Claim> claims)
        {
            var encId = claims.First(c => c.Type == ClaimTypes.PrimarySid).Value;
            return new User
            {
                Id = encryptionService.Decrypt(encryptionService.SecretKeys.TokenEncryptionSecretKey, encId)
            };
        }

        public User FromClaims(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            return FromClaims(jwtToken.Claims);
        }

        public IEnumerable<Claim> ToClaims(User user)
        {
            var encId = encryptionService.Encrypt(encryptionService.SecretKeys.TokenEncryptionSecretKey, user.Id!);
            return
            [
                new Claim(ClaimTypes.PrimarySid, encId)
            ];
        }
    }
}