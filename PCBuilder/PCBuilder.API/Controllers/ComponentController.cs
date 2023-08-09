using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.Services.DTO;
using PCBuilder.Services.Service;

namespace PCBuilder.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComponentController : ControllerBase
    {
        private readonly IComponentServices _componentServices;

        public ComponentController(IComponentServices componentServices)
        {
            _componentServices = componentServices;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllComponents()
        {
            var response = await _componentServices.GetComponents();

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetComponentById(int id)
        {
            var response = await _componentServices.GetComponentById(id);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        //[Authorize(Roles = "Admin, Employee")]
        [HttpPost]
        public async Task<IActionResult> CreateComponent([FromBody] ComponentDTO componentDTO)
        {
            var response = await _componentServices.CreateComponent(componentDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        //[Authorize(Roles = "Admin, Employee")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComponent(int id, [FromBody] ComponentDTO componentDTO)
        {
            var response = await _componentServices.UpdateComponent(id, componentDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        [HttpGet("FilterComponent")]
        public async Task<IActionResult> FilterComponents(decimal? minPrice, decimal? maxPrice, bool? isDescending)
        {
            var response = await _componentServices.GetProductsByPriceRange(minPrice, maxPrice, isDescending);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        //[Authorize(Roles = "Admin, Employee")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComponent(int id)
        {
            var response = await _componentServices.DeleteComponent(id);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        [HttpGet("SearchComponent")]
        public async Task<IActionResult> SearchCategoriesByName([FromQuery] string name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                var searchResult = await _componentServices.SearchComponentsByName(name);
                return Ok(searchResult);
            }
            else
            {
                var Components = await _componentServices.GetComponents();
                return Ok(Components);
            }
        }
    }
}
