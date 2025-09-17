using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;

namespace TemplateManager_Backend.Services
{
    public class CookieKeys
    {
        public const string Token = "X-Access-Token";
        public const string RefreshToken = "X-Refresh-Token";
    }
    public class SecretKeys
    {
        public const string Position = "SecretKeys";
        public string TokenEncryptionSecretKey { get; set; } = string.Empty;
        public string RefreshTokenEncryptionSecretKey { get; set; } = string.Empty;
    }
    public interface IEncryptionService
    {
        public SecretKeys SecretKeys { get; }
        string Encrypt(string key, string plainText);
        string Decrypt(string key, string cipherText);
    }

    public class EncryptionService(IOptions<SecretKeys> options) : IEncryptionService
    {
        public SecretKeys SecretKeys => options.Value;
        public string Encrypt(string key, string plainText)
        {
            byte[] iv = new byte[16];
            byte[] array;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using MemoryStream memoryStream = new();
                using CryptoStream cryptoStream = new((Stream)memoryStream, encryptor, CryptoStreamMode.Write);
                using (StreamWriter streamWriter = new((Stream)cryptoStream))
                {
                    streamWriter.Write(plainText);
                }

                array = memoryStream.ToArray();
            }

            return Convert.ToBase64String(array);
        }
        public string Decrypt(string key, string cipherText)
        {
            byte[] iv = new byte[16];
            byte[] buffer = Convert.FromBase64String(cipherText);

            using Aes aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(key);
            aes.IV = iv;
            ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

            using MemoryStream memoryStream = new(buffer);
            using CryptoStream cryptoStream = new((Stream)memoryStream, decryptor, CryptoStreamMode.Read);
            using StreamReader streamReader = new((Stream)cryptoStream);
            return streamReader.ReadToEnd();
        }
    }
}