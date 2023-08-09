using Microsoft.EntityFrameworkCore;
using PCBuilder.Repository.Repository;
using PCBuilder.Repository.Model;
using PCBuilder.Services.Service;
using PCBuilder.Services.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace PCBuilder.API.Config
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen();
            //Add DbContext
            services.AddDbContext<PcBuildingContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("ConnectionString"));
            });

            //Add Automapper
            services.AddAutoMapper(typeof(AutoMapperConfig));
            // Add Cors
            services.AddCors();

            // Dependency injection
            DependencyInjectionConfig.Configure(services);

            // handle login/sign up with jwt
            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration["JwtSettings:Issuer"],
                        ValidAudience = Configuration["JwtSettings:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.ASCII.GetBytes(Configuration["JwtSettings:SecretKey"])
                        ),
                        ClockSkew = TimeSpan.Zero
                    };
                })
                 .AddGoogle(options =>
                 {
                     options.ClientId = "888811245186-qcjo042285j46as9sf8s4u1mu59a697g.apps.googleusercontent.com";
                     options.ClientSecret = "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";
                 });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI( /*c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
                }*/
                );
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.UseCors(
                builder =>
                    builder
                        .WithOrigins("http://localhost:3000", "https://localhost:3000", "https://fpcshop.azurewebsites.net")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
            );

            app.UseHttpsRedirection();
            app.UseRouting();

            // xac thuc va phan quyen
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
