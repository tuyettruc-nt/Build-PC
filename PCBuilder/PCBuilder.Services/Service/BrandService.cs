using AutoMapper;
using PCBuilder.Repository.Model;
using PCBuilder.Repository.Repository;
using PCBuilder.Services.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Services.Service
{
    public interface IBrandServices
    {
        Task<ServiceResponse<List<BrandDTO>>> GetBrandsAsync();
        Task<ServiceResponse<BrandDTO>> GetBrandByIdAsync(int id);
        Task<ServiceResponse<BrandDTO>> CreateBrandAsync(BrandDTO brandDTO);
        Task<ServiceResponse<BrandDTO>> UpdateBrandAsync(int id, BrandDTO brandDTO);
        Task<ServiceResponse<bool>> DeleteBrandAsync(int id);
    }

    public class BrandService : IBrandServices
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IMapper _mapper;

        public BrandService(IBrandRepository brandRepository, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<BrandDTO>>> GetBrandsAsync()
        {
            ServiceResponse<List<BrandDTO>> response = new ServiceResponse<List<BrandDTO>>();

            try
            {
                var brands = await _brandRepository.GetAllBrandsAsync();
                var brandDTOs = _mapper.Map<List<BrandDTO>>(brands);

                response.Data = brandDTOs;
                response.Success = true;
                response.Message = "Brand retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<BrandDTO>> GetBrandByIdAsync(int id)
        {
            ServiceResponse<BrandDTO> response = new ServiceResponse<BrandDTO>();

            try
            {
                var brand = await _brandRepository.GetBrandByIdAsync(id);

                if (brand == null)
                {
                    response.Success = false;
                    response.Message = "Brand not found.";
                    return response;
                }

                var brandDTO = _mapper.Map<BrandDTO>(brand);

                response.Data = brandDTO;
                response.Success = true;
                response.Message = "Brand retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<BrandDTO>> CreateBrandAsync(BrandDTO brandDTO)
        {
            ServiceResponse<BrandDTO> response = new ServiceResponse<BrandDTO>();

            try
            {
                var brand = _mapper.Map<Brand>(brandDTO);
                var createdBrand = await _brandRepository.CreateBrandAsync(brand);
                var createdBrandDTO = _mapper.Map<BrandDTO>(createdBrand);

                response.Data = createdBrandDTO;
                response.Success = true;
                response.Message = "Brand create successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<BrandDTO>> UpdateBrandAsync(int id, BrandDTO brandDTO)
        {
            ServiceResponse<BrandDTO> response = new ServiceResponse<BrandDTO>();

            try
            {
                var existingBrand = await _brandRepository.GetBrandByIdAsync(id);

                if (existingBrand == null)
                {
                    response.Success = false;
                    response.Message = "Brand not found.";
                    return response;
                }
                var updatedBrand = _mapper.Map(brandDTO, existingBrand);
                var savedBrand = await _brandRepository.UpdateBrandAsync(updatedBrand);
                var savedBrandDTO = _mapper.Map<BrandDTO>(savedBrand);
               
                response.Data = savedBrandDTO;
                response.Success = true;
                response.Message = "Brand update successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteBrandAsync(int id)
        {
            ServiceResponse<bool> response = new ServiceResponse<bool>();

            try
            {
                var existingBrand = await _brandRepository.GetBrandByIdAsync(id);

                if (existingBrand == null)
                {
                    response.Success = false;
                    response.Message = "Brand not found.";
                    return response;
                }

                var success = await _brandRepository.DeleteBrandAsync(id);

                response.Data = success;
                response.Success = true;
                response.Message = "Brand delete successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }


    }
}
