using Eatzie.Data;
using Eatzie.Helpers;
using Eatzie.Interfaces;
using Eatzie.Interfaces.IRepository;
using Eatzie.Interfaces.IService;
using Eatzie.Repositories;
using Eatzie.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1."EmailSettings"
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// 2.PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Register Repository + Service => Dependency Injection
builder.Services.AddScoped<ISignInRepository, SignInRepository>();
builder.Services.AddScoped<ISignInService, SignInService>();

builder.Services.AddScoped<ISignUpService, SignUpService>();
builder.Services.AddScoped<ISignUpRepository, SignUpRepository>();

builder.Services.AddScoped<IForgotPasswordService, ForgotPasswordService>();
builder.Services.AddScoped<IForgotPasswordRepository, ForgotPasswordRepository>();
builder.Services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();

builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddControllers()
                 .AddNewtonsoftJson();

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