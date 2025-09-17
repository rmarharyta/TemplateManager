using Microsoft.EntityFrameworkCore;
using PuppeteerSharp;
using PuppeteerSharp.Media;
using TemplateManager_Backend.Data;
using TemplateManager_Backend.Models;

namespace TemplateManager_Backend.Services
{
    public class TemplateServices(AppDbContext _context)
    {
        public Template CreateTemplate(string userId, TemplateRequest request)
        {
            var template = new Template
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                Html = request.Html,
                UserId = userId
            };

            _context.Templates.Add(template);
            _context.SaveChanges();
            return template;
        }
        public List<Template> GetTemplates(string userId)
        {
            return  _context.Templates
                .Where(t => t.UserId == userId)
                .ToList();
        }

        public Template? GetTemplateById(string templateId)
        {
            return _context.Templates.FirstOrDefault(t => t.Id == templateId);
        }

        public void UpdateTemplate(string templateId, TemplateRequest request)
        {
            var template =  _context.Templates.FirstOrDefault(t => t.Id == templateId)
                                ?? throw new Exception("There is no such template");

            template.Name = request.Name;
            template.Html = request.Html;
             _context.SaveChanges();
        }

        public void DeleteTemplate(string templateId)
        {
            var template =  _context.Templates.FirstOrDefault(t => t.Id == templateId)
                ?? throw new Exception("There is no such template");

            _context.Templates.Remove(template);
            _context.SaveChanges();
        }

        public async Task<byte[]> GeneratePdfHtmlAsync(string html, Dictionary<string, string> data)
        {
            foreach (var kv in data)
                html = html.Replace($"{{{{{kv.Key}}}}}", kv.Value);

            var browserFetcher = new BrowserFetcher();
            await browserFetcher.DownloadAsync(); 

            await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions { Headless = true });
            await using var page = await browser.NewPageAsync();

            await page.SetContentAsync(html);
            var pdfBytes = await page.PdfDataAsync(new PdfOptions
            {
                Format = PaperFormat.A4,
                PrintBackground = true
            });

            return pdfBytes;
        }
    }
}
