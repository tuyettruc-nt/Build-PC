using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.Services.DTO;
using PCBuilder.Services.Service;

namespace PCBuilder.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IBrandServices _brandServices;

        public BrandController(IBrandServices brandServices)
        {
            _brandServices = brandServices;
        }

        // GET: api/Brand
        [HttpGet]
        public async Task<IActionResult> GetAllBrands()
        {
            var brands = await _brandServices.GetBrandsAsync();
            return Ok(brands);
        }

        // GET: api/Brand/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBrandById(int id)
        {
            var brand = await _brandServices.GetBrandByIdAsync(id);

            if (brand == null)
            {
                return NotFound();
            }

            return Ok(brand);
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateBrand(BrandDTO brandDTO)
        {
            var response = await _brandServices.CreateBrandAsync(brandDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        //[Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBrand(int id, BrandDTO brandDTO)
        {
            if (id != brandDTO.Id)
            {
                return BadRequest("Invalid brand ID");
            }

            var response = await _brandServices.UpdateBrandAsync(id, brandDTO);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response.Message);
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var response = await _brandServices.DeleteBrandAsync(id);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }

}
