
using System;
using Microsoft.EntityFrameworkCore;
using TemplateManager_Back;
using TemplateManager_Backend.Data;
using TemplateManager_Backend.Models;
using TemplateManager_Backend.Services;

namespace TemplateManager_Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCrossOrigins();
            builder.Services.AddMemoryCache();
            builder.Services.RegisterSecretKeys(builder.Configuration);
            builder.Services.RegisterServices();
            builder.Services.AddJwtAuthentication(builder.Configuration);
            builder.Services.AddAuthorization();

            // Add services to the container.
            builder.Services.AddControllers();
            // Підключення DbContext (Scoped)
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors("_myPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseHttpsRedirection();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
