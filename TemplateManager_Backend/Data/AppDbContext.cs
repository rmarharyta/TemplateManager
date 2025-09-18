using Microsoft.EntityFrameworkCore;
using TemplateManager_Backend.Models;

namespace TemplateManager_Backend.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> context) : DbContext(context)
    {
        public DbSet<User> Users { get; set; }

        public DbSet<Template> Templates { get; set; }
    }
}
