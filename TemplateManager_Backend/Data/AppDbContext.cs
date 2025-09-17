using Microsoft.EntityFrameworkCore;
using TemplateManager_Backend.Models;

namespace TemplateManager_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> context) : base(context)
        {

        }
        public DbSet<User> Users { get; set; }

        public DbSet<Template> Templates { get; set; }
    }
}
