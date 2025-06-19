using Eatzie.Data; // Đảm bảo namespace này đúng với nơi bạn đặt ApplicationDbContext
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Repositories;
using Eatzie.Services;
using Microsoft.EntityFrameworkCore;

namespace Eatzie
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            // Cấu hình kết nối cơ sở dữ liệu PostgreSQL
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString));

            // Đăng ký Repository và Service vào Dependency Injection
            builder.Services.AddScoped<ISignInRepository, SignInRepository>();
            builder.Services.AddScoped<ISignInService, SignInService>();


            builder.Services.AddControllers()
                    .AddNewtonsoftJson();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}