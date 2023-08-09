using PCBuilder.Repository.Repository;
using PCBuilder.Repository.Model;
using PCBuilder.Services.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PCBuilder.Services.DTO;
using AutoMapper;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.ComponentModel;

namespace PCBuilder.Services.Service
{
    public interface IPCServices
    {
        /// <summary>
        /// Return list of companies which are not marked as deleted.
        /// </summary>
        /// <returns>List Of PcDTO</returns>
        /// 
        Task<ServiceResponse<List<PcDTO>>> GetPCList();
        Task<ServiceResponse<List<PcDTO>>> GetPCListByAdmin();
        Task<ServiceResponse<List<PcDTO>>> GetPCListByCustomer();
        Task<ServiceResponse<PcDTO>> GetPCByID(int ID);
        Task<ServiceResponse<PcDTO>> CreatePC(PcDTO pcDTO);
        Task<ServiceResponse<PcDTO>> UpdatePC(int ID, PcDTO pcDTO);
        Task<ServiceResponse<bool>> DeletePC(int ID);
        Task<ServiceResponse<List<PcDTO>>> SearchPCsByName(String name);
        Task<ServiceResponse<List<PCInformationDTO>>> GetPCComponent();
        Task<ServiceResponse<PCInformationDTO>> GetPCComponentByID(int pcId);
        Task<ServiceResponse<PcAddComponentDTO>> CreatePCAndAddComponentsToPCByAdmin(PcAddComponentDTO pcAddComponentDTO);
        Task<ServiceResponse<PCInformationDTO>> UpdateComponentsOfPC(int pcId, List<int> componentIds);
        Task<ServiceResponse<PCInformationDTO>> CreatePCWithComponentsFromTemplate(int templateId, List<int> componentIds);
        Task<ServiceResponse<bool>> DeletePCWithComponent(int pcId);
    }

    public class PCService : IPCServices
    {
        private readonly IPCRepository _repository;
        private readonly IMapper _mapper;
        private readonly IPcComponentRepository _pcComponentRepository;
        private readonly IComponentRepository _componentRepository;

        public PCService(IPCRepository pCRepository, IMapper mapper, IPcComponentRepository pcComponentRepository, IComponentRepository componentRepository)
        {
            this._repository = pCRepository;
            this._mapper = mapper;
            this._componentRepository = componentRepository;
            this._pcComponentRepository = pcComponentRepository;
        }
        public async Task<ServiceResponse<List<PcDTO>>> GetPCList()
        {
            ServiceResponse<List<PcDTO>> _response = new();

            try
            {

                var PCList = await _repository.GetAllPcsAsync();

                var PcListDTO = new List<PcDTO>();

                foreach (var item in PCList)
                {
                    if (item.IsPublic == true)
                    {
                        PcListDTO.Add(_mapper.Map<PcDTO>(item));
                    }
                }

                //OR 
                //PcListDTO.AddRange(from item in PCList select _mapper.Map<PcDTO>(item));
                _response.Success = true;
                _response.Message = "ok";
                _response.Data = PcListDTO;

            }
            catch (Exception ex)
            {
                _response.Success = false;
                _response.Data = null;
                _response.Message = "Error";
                _response.ErrorMessages = new List<string> { Convert.ToString(ex.Message) };
            }

            return _response;
        }
        public async Task<ServiceResponse<List<PcDTO>>> GetPCListByAdmin()
        {
            ServiceResponse<List<PcDTO>> _response = new();

            try
            {

                var PCList = await _repository.GetAllPcsAsync();

                var PcListDTO = new List<PcDTO>();

                foreach (var item in PCList)
                {

                    PcListDTO.Add(_mapper.Map<PcDTO>(item));

                }

                //OR 
                //PcListDTO.AddRange(from item in PCList select _mapper.Map<PcDTO>(item));
                _response.Success = true;
                _response.Message = "ok";
                _response.Data = PcListDTO;

            }
            catch (Exception ex)
            {
                _response.Success = false;
                _response.Data = null;
                _response.Message = "Error";
                _response.ErrorMessages = new List<string> { Convert.ToString(ex.Message) };
            }

            return _response;
        }

        public async Task<ServiceResponse<List<PcDTO>>> GetPCListByCustomer()
        {
            ServiceResponse<List<PcDTO>> _response = new();

            try
            {

                var PCList = await _repository.GetAllPcsAsync();

                var PcListDTO = new List<PcDTO>();

                foreach (var item in PCList)
                {
                    if (item.IsPublic == true && item.IsTemplate == true)
                    {
                        PcListDTO.Add(_mapper.Map<PcDTO>(item));
                    }
                }

                //OR 
                //PcListDTO.AddRange(from item in PCList select _mapper.Map<PcDTO>(item));
                _response.Success = true;
                _response.Message = "ok";
                _response.Data = PcListDTO;

            }
            catch (Exception ex)
            {
                _response.Success = false;
                _response.Data = null;
                _response.Message = "Error";
                _response.ErrorMessages = new List<string> { Convert.ToString(ex.Message) };
            }

            return _response;
        }
        public async Task<ServiceResponse<List<PCInformationDTO>>> GetPCComponent()
        {
            ServiceResponse<List<PCInformationDTO>> response = new ServiceResponse<List<PCInformationDTO>>();

            try
            {
                var pcList = await _repository.GetPcsWithComponentsAsync();

                List<PCInformationDTO> pcDTOList = new List<PCInformationDTO>();

                foreach (var pc in pcList)
                {
                    var pcDTO = _mapper.Map<PCInformationDTO>(pc);
                    pcDTO.Components = pc.PcComponents.Select(pcComp => _mapper.Map<ComponentDTO>(pcComp.Component)).ToList();
                    pcDTOList.Add(pcDTO);
                }
                var pcComponentDTOList = new List<PCInformationDTO>();

                foreach (var pcDTO in pcDTOList)
                {
                    var pcComponentDTO = new PCInformationDTO
                    {
                        Id = pcDTO.Id,
                        Name = pcDTO.Name,
                        Summary = pcDTO.Summary,
                        Detail = pcDTO.Detail,
                        Description = pcDTO.Description,
                        Price = pcDTO.Price,
                        Discount = pcDTO.Discount,
                        IsPublic = pcDTO.IsPublic,
                        TemplateId = pcDTO.TemplateId,
                        Image = pcDTO.Image,
                        DesignBy = pcDTO.DesignBy,
                        IsTemplate = pcDTO.IsTemplate,
                        Components = new List<ComponentDTO>()
                    };

                    foreach (var componentDTO in pcDTO.Components)
                    {
                        var component = new ComponentDTO
                        {
                            Id = componentDTO.Id,
                            Name = componentDTO.Name,
                            Image = componentDTO.Image,
                            Price = componentDTO.Price,
                            Summary = componentDTO.Summary,
                            Description = componentDTO.Description,
                            CategoryId = componentDTO.CategoryId,
                            BrandId = componentDTO.BrandId

                        };

                        pcComponentDTO.Components.Add(component);
                    }

                    pcComponentDTOList.Add(pcComponentDTO);
                }

                response.Success = true;
                response.Message = "PCs with components retrieved successfully";
                response.Data = pcComponentDTOList;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error retrieving PCs with components";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }


        public async Task<ServiceResponse<PCInformationDTO>> GetPCComponentByID(int PcId)
        {
            ServiceResponse<PCInformationDTO> response = new ServiceResponse<PCInformationDTO>();

            try
            {
                var pc = await _repository.GetPcsWithComponentByIdAsync(PcId);

                if (pc == null)
                {
                    response.Success = false;
                    response.Message = "PC not found";
                    return response;
                }

                var pcDTO = _mapper.Map<PCInformationDTO>(pc);
                pcDTO.Components = pc.PcComponents.Select(pcComp => _mapper.Map<ComponentDTO>(pcComp.Component)).ToList();


                var pcComponentDTO = new PCInformationDTO
                {
                    Id = pcDTO.Id,
                    Name = pcDTO.Name,
                    Summary = pcDTO.Summary,
                    Detail = pcDTO.Detail,
                    Description = pcDTO.Description,
                    Price = pcDTO.Price,
                    Discount = pcDTO.Discount,
                    IsPublic = pcDTO.IsPublic,
                    TemplateId = pcDTO.TemplateId,
                    Image = pcDTO.Image,
                    DesignBy = pcDTO.DesignBy,
                    IsTemplate = pcDTO.IsTemplate,
                    Components = new List<ComponentDTO>()
                };

                foreach (var componentDTO in pcDTO.Components)
                {
                    var component = new ComponentDTO
                    {
                        Id = componentDTO.Id,
                        Name = componentDTO.Name,
                        Image = componentDTO.Image,
                        Price = componentDTO.Price,
                        Summary = componentDTO.Summary,
                        Description = componentDTO.Description,
                        CategoryId = componentDTO.CategoryId,
                        BrandId = componentDTO.BrandId
                    };

                    pcComponentDTO.Components.Add(component);
                }
                response.Success = true;
                response.Message = "PC with components retrieved successfully";
                response.Data = pcComponentDTO;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error retrieving PC with components";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }





        public async Task<ServiceResponse<PcDTO>> GetPCByID(int ID)
        {
            ServiceResponse<PcDTO> _response = new();
            try
            {
                var pc = await _repository.GetPcsByIdAsync(ID);



                var pcDTO = _mapper.Map<PcDTO>(pc);

                _response.Success = true;
                _response.Message = "ok";
                _response.Data = pcDTO;
            }
            catch (Exception ex)
            {
                _response.Success = false;
                _response.Data = null;
                _response.Message = "Error";
                _response.ErrorMessages = new List<string> { Convert.ToString(ex.Message) };
            }

            return _response;
        }
        public async Task<ServiceResponse<PcDTO>> CreatePC(PcDTO pcDTO)
        {
            ServiceResponse<PcDTO> _response = new ServiceResponse<PcDTO>();

            try
            {
                pcDTO.IsPublic = false;
                pcDTO.IsTemplate = false;
                var pc = _mapper.Map<Pc>(pcDTO);


                var createdPc = await _repository.CreatePcAsync(pc);

                var createdPcDTO = _mapper.Map<PcDTO>(createdPc);

                _response.Success = true;
                _response.Message = "PC created successfully";
                _response.Data = createdPcDTO;
            }
            catch (Exception ex)
            {
                _response.Success = false;
                _response.Message = "Error";
                _response.ErrorMessages = new List<string> { ex.Message };
            }

            return _response;
        }
        public async Task<ServiceResponse<PcDTO>> UpdatePC(int ID, PcDTO pcDTO)
        {
            ServiceResponse<PcDTO> _response = new ServiceResponse<PcDTO>();

            try
            {
                var pc = await _repository.GetPcsByIdAsync(ID);

                if (pc == null)
                {

                    _response.Success = false;
                    _response.Message = "PC not found";
                    return _response;
                }

                var PC = _mapper.Map(pcDTO, pc);
                var updatedPc = await _repository.UpdatePcAsync(PC);
                var updatedPcDTO = _mapper.Map<PcDTO>(updatedPc);
                _response.Success = true;
                _response.Message = "PC updated successfully";
                _response.Data = updatedPcDTO;
            }
            catch (Exception ex)
            {
                _response.Success = false;
                _response.Message = "Error";
                _response.ErrorMessages = new List<string> { ex.Message };
            }

            return _response;
        }

        public async Task<ServiceResponse<bool>> DeletePC(int ID)
        {
            ServiceResponse<bool> _response = new();

            try
            {
                var pc = await _repository.DeletePcAsync(ID);

                if (pc == null)
                {
                    _response.Success = false;
                    _response.Message = "PC not found";
                    return _response;
                }



                _response.Success = true;
                _response.Message = "PC deleted successfully";
                _response.Data = true;
            }
            catch (Exception ex)
            {
                _response.Success = false;
                _response.Message = "Error";
                _response.ErrorMessages = new List<string> { ex.Message };
            }

            return _response;
        }
        public async Task<ServiceResponse<List<PcDTO>>> SearchPCsByName(string name)
        {
            ServiceResponse<List<PcDTO>> _response = new();

            try
            {
                var searchResult = await _repository.SearchPcsByNameAsync(name);

                var pcListDTO = searchResult.Select(pc => _mapper.Map<PcDTO>(pc)).ToList();

                _response.Success = true;
                _response.Message = "PC search successfully";
                _response.Data = pcListDTO;
            }
            catch (Exception ex)
            {
                _response.Success = false;
                _response.Data = null;
                _response.Message = "Error";
                _response.ErrorMessages = new List<string> { Convert.ToString(ex.Message) };
            }

            return _response;
        }

        public async Task<ServiceResponse<PcAddComponentDTO>> CreatePCAndAddComponentsToPCByAdmin(PcAddComponentDTO pcAddComponentDTO)
        {
            ServiceResponse<PcAddComponentDTO> response = new ServiceResponse<PcAddComponentDTO>();

            try
            {

                // Fetch the PC from the database


                var pc = _mapper.Map<Pc>(pcAddComponentDTO);


                var createdPc = await _repository.CreatePcAsync(pc);




                //if (pc.IsTemplate == true)
                //{
                //    response.Success = false;
                //    response.Message = "PC Not Custom";
                //    return response;
                //}


                // Fetch the existing components from the database based on the IDs
                var listComponents = await _componentRepository.GetComponentsByIdsAsync(pcAddComponentDTO.Components);
                if (listComponents == null)
                {
                    response.Success = false;
                    response.Message = "PC or component not found.";

                }
                var newComponents = new List<ComponentDTO>();
                // Create a PC_Component entity for each existing component

                foreach (var component in listComponents)
                {
                    var pcComponent = new PcComponent
                    {
                        ComponentId = component.Id,
                        PcId = createdPc.Id,
                        Quantity = 1,

                    };
                    await _pcComponentRepository.AddPcComponentsAsync(pcComponent);
                    var componentDTO = new ComponentDTO
                    {
                        Id = component.Id,
                        Name = component.Name,
                        Image = component.Image,
                        Price = (decimal)component.Price,
                        Summary = component.Summary,
                        Description = component.Description,
                        BrandId = component.BrandId,
                        CategoryId = component.CategoryId
                    };

                    newComponents.Add(componentDTO);
                }
                createdPc.IsPublic = true;
                createdPc.IsTemplate = true;
                var totalPrice = listComponents.Select(c => c.Price);
                createdPc.Price = (decimal)totalPrice.Sum();
                createdPc.DesignBy = 3;

                createdPc.Description += string.Join("|", listComponents.Select(c => c.Description));
                createdPc.Summary += string.Join("|", listComponents.Select(c => c.Summary));
                createdPc.Detail += string.Join(". ", listComponents.Select(c => c.Name));
                await _repository.UpdatePcAsync(createdPc);

                // Add the PC_Component entities to the database
                // Update the response with success message and PC DTO
                var pcDTO = _mapper.Map<PcAddComponentDTO>(createdPc);
                pcDTO.Components = pcAddComponentDTO.Components;
                response.Success = true;
                response.Message = "Components added to PC successfully";
                response.Data = pcDTO;


            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error adding components to PC";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

        public async Task<ServiceResponse<PCInformationDTO>> UpdateComponentsOfPC(int pcId, List<int> componentIds)
        {
            ServiceResponse<PCInformationDTO> response = new ServiceResponse<PCInformationDTO>();

            try
            {
                // Fetch the PC from the database
                var pc = await _repository.GetPcsByIdAsync(pcId);
                if (pc == null)
                {
                    response.Success = false;
                    response.Message = "PC not found";
                    return response;
                }
       

                // Remove existing PC_Component entities for the PC
                await _pcComponentRepository.RemovePcComponentsByPcIdAsync(pcId);

                // Fetch the new components from the database based on the IDs
                var newComponents = await _pcComponentRepository.GetComponentsByIdsAsync(componentIds);
                if (newComponents == null)
                {
                    response.Success = false;
                    response.Message = "Components not found.";
                    return response;
                }

                // Create and add new PC_Component entities for the new components

                foreach (var component in newComponents)
                {
                    var pcComponent = new PcComponent
                    {
                        ComponentId = component.Id,
                        PcId = pc.Id,
                        Quantity = 1,
                    };
                    

     

                    await _pcComponentRepository.AddPcComponentsAsync(pcComponent);
                }

                // Update the PC description and summary
                var componentDetails = newComponents.Select(c => c.Name);
                pc.Detail = string.Join(". ", componentDetails);
                var componentDecriptions = newComponents.Select(c => c.Description);
                pc.Description = string.Join("|", componentDecriptions);
                var componentSummary = newComponents.Select(c => c.Summary);
                pc.Summary = string.Join("|", componentSummary);
                var componentPrice = newComponents.Select(c => c.Price);
                pc.Price = componentPrice.Sum();
                pc.IsTemplate = true;
                pc.DesignBy = 1;

                // Update the PC in the database
                await _repository.UpdatePcAsync(pc);

                // Map the updated PC to DTO
                var pcDTO = _mapper.Map<PCInformationDTO>(pc);
                pcDTO.Components = newComponents.Select(c => new ComponentDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Image = c.Image,
                    Price = (decimal)c.Price,
                    Summary = c.Summary,
                    Description = c.Description,
                    BrandId = c.BrandId,
                    CategoryId = c.CategoryId
                }).ToList();

                // Update the response with success message and PC DTO
                response.Success = true;
                response.Message = "Components updated successfully";
                response.Data = pcDTO;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error updating components of PC";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }
        public async Task<ServiceResponse<PCInformationDTO>> CreatePCWithComponentsFromTemplate(int templateId, List<int> componentIds)
        {
            ServiceResponse<PCInformationDTO> response = new ServiceResponse<PCInformationDTO>();

            try
            {
                // Fetch the template PC from the database
                var templatePC = await _repository.GetPcsByIdAsync(templateId);
                if (templatePC == null)
                {
                    response.Success = false;
                    response.Message = "Template PC not found";
                    return response;
                }

                // Create a new PC based on the template
                var newPC = new Pc
                {
                    Name = "Custom PC by Customer",
                    Summary = "",
                    Detail = "",
                    Description = "",
                    Price = 0,
                    Discount = 0,
                    TemplateId = templatePC.Id,
                    IsPublic = (bool)templatePC.IsPublic,
                    DesignBy = 1,
                    Image = templatePC.Image,
                    IsTemplate = false,
                };
                await _repository.CreatePcAsync(newPC);

                // Fetch the components from the database based on the componentIds
                var newComponents = await _pcComponentRepository.GetComponentsByIdsAsync(componentIds);
                if (newComponents == null || newComponents.Count != componentIds.Count)
                {
                    response.Success = false;
                    response.Message = "One or more components not found.";
                    return response;
                }

                // Create and add new PC_Component entities for the new components
                var newComponent = new List<ComponentDTO>();
                foreach (var component in newComponents)
                {
                    var pcComponent = new PcComponent
                    {
                        ComponentId = component.Id,
                        PcId = newPC.Id,
                        Quantity = 1,
                    };

                    
                    
                    await _pcComponentRepository.AddPcComponentsAsync(pcComponent);
                    var componentDTO = new ComponentDTO
                    {
                        Id = component.Id,
                        Name = component.Name,
                        Image = component.Image,
                        Price = (decimal)component.Price,
                        Summary = component.Summary,
                        Description = component.Description,
                        BrandId = component.BrandId,
                        CategoryId = component.CategoryId
                    };

                    newComponent.Add(componentDTO);
                }

                // Update the PC description and summary
                var totalPrice = newComponents.Select(c => c.Price);
                newPC.Price += totalPrice.Sum();
                newPC.IsPublic = true;
                newPC.IsTemplate = false;
                var componentDetail = newComponents.Select(c => c.Name);
                newPC.Detail = string.Join(". ", componentDetail);
                var componentDecription = newComponents.Select(c => c.Description);
                newPC.Description = string.Join("|", componentDecription);
                var componentSummary = newComponents.Select(c => c.Summary);
                newPC.Summary = string.Join("|", componentSummary);
                await _repository.UpdatePcAsync(newPC);

                // Save the new PC to the database
                // Code here to save the new PC to your database

                // Map the new PC to DTO
                var newPCDTO = _mapper.Map<PCInformationDTO>(newPC);
                newPCDTO.Components = newComponent;
                // Update the response with success message and new PC DTO
                response.Success = true;
                response.Message = "New PC with components created successfully";
                response.Data = newPCDTO;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error creating new PC with components";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }



        public async Task<ServiceResponse<bool>> DeletePCWithComponent(int pcId)
        {
            ServiceResponse<bool> response = new ServiceResponse<bool>();

            try
            {
                var pc = await _repository.GetPcsWithComponentByIdAsync(pcId);

                if (pc == null)
                {
                    response.Success = false;
                    response.Message = "PC not found";
                    return response;
                }

                // Xóa các bản ghi trong bảng trung gian PCComponent
                await _pcComponentRepository.DeletePcComponent(pcId);

                // Xóa PC chính
                await _repository.DeletePcAsync(pcId);

                response.Success = true;
                response.Message = "PC and its components deleted successfully";
                response.Data = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error deleting PC";
                response.ErrorMessages = new List<string> { ex.Message };
            }

            return response;
        }

    }
}
