// Configurations/DependencyInjectionConfig.cs
using Microsoft.Extensions.DependencyInjection;
using PCBuilder.Repository.Repository;
using PCBuilder.Services.Service;

public static class DependencyInjectionConfig
{
    public static void Configure(IServiceCollection services)
    {
        #region Dependency Injection
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPCRepository, PCRepository>();

        services.AddScoped<IUserServices, UserService>();
        services.AddScoped<IPCServices, PCService>();

        services.AddScoped<IBrandRepository, BrandRepository>();
        services.AddScoped<IBrandServices, BrandService>();

        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ICategoryServices, CategoryService>();

        services.AddScoped<IComponentRepository, ComponentRepository>();
        services.AddScoped<IComponentServices, ComponentService>();

        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IOrderServices, OrderService>();

        services.AddScoped<IPcComponentRepository, PcComponentRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();

        services.AddScoped<IGoogleServices, GoogleService>();

        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IPaymentServices, PaymentService>();
        #endregion
    }
}
