using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.Repository.Model;
using PCBuilder.Services.DTO;
using PCBuilder.Services.Service;

namespace PCBuilder.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PCController : ControllerBase
    {
        private readonly IPCServices _IPCServices;
        public PCController(IPCServices IPCServices)
        {
            _IPCServices = IPCServices;
        }

        //[Authorize(Roles = "Customer")]
        [HttpGet("GetListByCustomer")]
        public async Task<IActionResult> GetPCListByCustomer()
        {
            var PCs = await _IPCServices.GetPCListByCustomer();
            if (PCs == null)
            {
                return NotFound();
            }
            return Ok(PCs);
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("GetListByAdmin")]
        public async Task<IActionResult> GetPCListByAdmin()
        {
            var PCs = await _IPCServices.GetPCListByAdmin();
            if (PCs == null)
            {
                return NotFound();
            }
            return Ok(PCs);
        }

        [HttpGet("PCWithComponent")]
        public async Task<IActionResult> GetPCComponent()
        {
            var response = await _IPCServices.GetPCComponent();

            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("PCWithComponent/{PcId}")]
        public async Task<IActionResult> GetPcComponentById(int PcId)
        {
            var response = await _IPCServices.GetPCComponentByID(PcId);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }



        [HttpGet("{PcId}")]
        public async Task<IActionResult> GetPcByIdList(int PcId)
        {
            var pc = await _IPCServices.GetPCByID(PcId);

            if (pc == null)
            {
                return NotFound();
            }

            return Ok(pc);
        }


        [HttpPost]
        public async Task<IActionResult> CreatePC([FromBody] PcDTO pcCreateDTO)
        {
            var response = await _IPCServices.CreatePC(pcCreateDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePC(int id, [FromBody] PcDTO pcUpdateDTO)
        {
            var response = await _IPCServices.UpdatePC(id, pcUpdateDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePC(int id)
        {
            var response = await _IPCServices.DeletePC(id);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
        [HttpPost("CreatePCAndAddComponentsToPCByAdmin")]
        public async Task<IActionResult> CreatePCAndAddComponentsToPCByAdmin(PcAddComponentDTO pcDTO)
        {
            var response = await _IPCServices.CreatePCAndAddComponentsToPCByAdmin(pcDTO);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        [HttpGet("SearchPC")]
        public async Task<IActionResult> SearchPCsByName([FromQuery] string name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                var searchResult = await _IPCServices.SearchPCsByName(name);
                return Ok(searchResult);
            }
            else
            {
                var Pcs = await _IPCServices.GetPCListByCustomer();
                return Ok(Pcs);
            }
        }

        [HttpPut("{id}/UpdateComponentsOfPC")]
        public async Task<IActionResult> UpdateComponentsOfPC(int id, List<int> componentIds)
        {
            var response = await _IPCServices.UpdateComponentsOfPC(id, componentIds);

            if (response.Success)
            {
                var pcComponentDTO = response.Data;
                return Ok(pcComponentDTO);
            }

            return BadRequest(response.Message);
        }
        [HttpPost("CreatePCWithComponentsFromTemplate")]
        public async Task<IActionResult> CreatePCFromTemplate(int templateId, List<int> componentIds)
        {
            var response = await _IPCServices.CreatePCWithComponentsFromTemplate(templateId, componentIds);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}/DeletePCWithComponent")]
        public async Task<IActionResult> DeletePCWithComponent(int id)
        {
            var response = await _IPCServices.DeletePCWithComponent(id);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }
    }
}
