using Microsoft.EntityFrameworkCore;
using PCBuilder.Repository.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Repository.Repository
{
    public interface ICategoryRepository
    {
        Task<ICollection<Category>> GetAllCategoriesAsync();
        Task<Category> GetCategoryByIdAsync(int id);
        Task<Category> CreateCategoryAsync(Category category);
        Task<Category> UpdateCategoryAsync(Category category);
        Task<bool> DeleteCategoryAsync(int id);
        Task<ICollection<Category>> SearchCategorysByNameAsync(String name);
    }
    public class CategoryRepository : ICategoryRepository
    {
        private readonly PcBuildingContext _dataContext;

        public CategoryRepository(PcBuildingContext context)
        {
            _dataContext = context;
        }

        public async Task<ICollection<Category>> GetAllCategoriesAsync()
        {
            return await _dataContext.Categories.ToListAsync();
        }

        public async Task<Category> GetCategoryByIdAsync(int id)
        {
            return await _dataContext.Categories.FindAsync(id);
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            if(category.ParentId == 0)
            {
                category.ParentId = null;
            }
            _dataContext.Categories.Add(category);
            await _dataContext.SaveChangesAsync();
            return category;
        }

        public async Task<Category> UpdateCategoryAsync(Category category)
        {
            _dataContext.Categories.Update(category);
            await _dataContext.SaveChangesAsync();
            return category;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _dataContext.Categories.FindAsync(id);
            if (category == null)
                return false;

            _dataContext.Categories.Remove(category);
            await _dataContext.SaveChangesAsync();
            return true;
        }
        public async Task<ICollection<Category>> SearchCategorysByNameAsync(string name)
        {
            return await _dataContext.Categories
                .Where(Category => Category.Name.Contains(name))
                .ToListAsync();
        }

      
    }

}
