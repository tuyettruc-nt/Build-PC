using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.Services.DTO;
using PCBuilder.Services.Service;

namespace PCBuilder.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryServices _categoryServices;

        public CategoryController(ICategoryServices categoryServices)
        {
            _categoryServices = categoryServices;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryServices.GetCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _categoryServices.GetCategoryByIdAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateCategory(CategoryDTO categoryDTO)
        {
            var createdCategory = await _categoryServices.CreateCategoryAsync(categoryDTO);

            if (!createdCategory.Success)
            {
                return BadRequest(createdCategory);
            }

            return Ok(createdCategory);
        }

        //[Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryDTO categoryDTO)
        {
            var updatedCategory = await _categoryServices.UpdateCategoryAsync(id, categoryDTO);

            if (!updatedCategory.Success)
            {
                return BadRequest(updatedCategory);
            }

            return Ok(updatedCategory);
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var deletedCategory = await _categoryServices.DeleteCategoryAsync(id);

            if (!deletedCategory.Success)
            {
                return BadRequest(deletedCategory);
            }

            return Ok(deletedCategory);
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchCategoriesByName([FromQuery] string name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                var searchResult = await _categoryServices.SearchCategoriesByName(name);
                return Ok(searchResult);
            }
            else
            {
                var Categories = await _categoryServices.GetCategoriesAsync();
                return Ok(Categories);
            }
        }
    }

}
