using Microsoft.EntityFrameworkCore;
using PCBuilder.Repository.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Repository.Repository
{
    public interface IBrandRepository
    {
        Task<ICollection<Brand>> GetAllBrandsAsync();
        Task<Brand> GetBrandByIdAsync(int id);
        Task<Brand> CreateBrandAsync(Brand brand);
        Task<Brand> UpdateBrandAsync(Brand brand);
        Task<bool> DeleteBrandAsync(int id);
    }

    public class BrandRepository : IBrandRepository
    {
        private readonly PcBuildingContext _dataContext;

        public BrandRepository(PcBuildingContext context)
        {
            _dataContext = context;
        }

        public async Task<ICollection<Brand>> GetAllBrandsAsync()
        {
            return await _dataContext.Brands.ToListAsync();
        }

        public async Task<Brand> GetBrandByIdAsync(int id)
        {
            return await _dataContext.Brands.FindAsync(id);
        }

        public async Task<Brand> CreateBrandAsync(Brand brand)
        {
            _dataContext.Brands.Add(brand);
            await _dataContext.SaveChangesAsync();
            return brand;
        }

        public async Task<Brand> UpdateBrandAsync(Brand brand)
        {
            _dataContext.Brands.Update(brand);
            await _dataContext.SaveChangesAsync();
            return brand;
        }

        public async Task<bool> DeleteBrandAsync(int id)
        {
            var brand = await _dataContext.Brands.FindAsync(id);

            if (brand != null)
            {
                _dataContext.Brands.Remove(brand);
                await _dataContext.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }


}
