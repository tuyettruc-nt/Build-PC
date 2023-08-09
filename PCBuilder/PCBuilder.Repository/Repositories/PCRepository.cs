using Microsoft.EntityFrameworkCore;
using PCBuilder.Repository.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace PCBuilder.Repository.Repository
{
    public interface IPCRepository
    {
        /// <summary>
        /// Return all companies including records marked as deleted and disabled
        /// </summary>
        /// <returns>Models.Pc</returns>
        Task<ICollection<Pc>> GetAllPcsAsync();
        Task<Pc> GetPcsByIdAsync(int PcId);
        Task<Pc> CreatePcAsync(Pc pc);
        Task<Pc> UpdatePcAsync(Pc pc);
        Task<bool> DeletePcAsync(int id);
        Task<ICollection<Pc>> SearchPcsByNameAsync(string name);
        Task<ICollection<Pc>> GetPcsWithComponentsAsync();
        Task<Pc> GetPcsWithComponentByIdAsync(int PcId);
        Task SaveAsync();
    }
    public class PCRepository : IPCRepository
    {
        private readonly PcBuildingContext _dataContext;
        public PCRepository(PcBuildingContext context)
        {
            _dataContext = context;
        }

        public async Task<ICollection<Pc>> GetAllPcsAsync()
        {
            return await _dataContext.Pcs.Include(e => e.PcComponents).ToListAsync();
        }

        public async Task<Pc> GetPcsByIdAsync(int PcId)
        {
            return await _dataContext.Pcs.FindAsync(PcId);
            
        }
        public async Task<Pc> CreatePcAsync(Pc pc)
        {
            if(pc.TemplateId == 0)
            {
                pc.TemplateId = null;
            }
            _dataContext.Pcs.Add(pc);
            await _dataContext.SaveChangesAsync();
            return pc;
        }

        public async Task<Pc> UpdatePcAsync(Pc pc)
        {
            if (pc.TemplateId == 0)
            {
                pc.TemplateId = null;
            }
            _dataContext.Pcs.Update(pc);
            await _dataContext.SaveChangesAsync();
            return pc;
        }

        public async Task<bool> DeletePcAsync(int id)
        {
            var pc = await _dataContext.Pcs.FindAsync(id);
            if (pc == null)
            {
                return false;
            }

            _dataContext.Pcs.Remove(pc);
            await _dataContext.SaveChangesAsync();
            return true;
        }
        public async Task<ICollection<Pc>> SearchPcsByNameAsync(string name)
        {
            return await _dataContext.Pcs
                .Where(pc => pc.Name.Contains(name))
                .ToListAsync();
        }

       

        public async Task<ICollection<Pc>> GetPcsWithComponentsAsync()
        {
            return await _dataContext.Pcs
        .Include(pc => pc.PcComponents)
        .ThenInclude(pcComp => pcComp.Component)
        .ToListAsync();
        }

        public async Task<Pc> GetPcsWithComponentByIdAsync(int PcId)
        {
            return await _dataContext.Pcs
        .Include(pc => pc.PcComponents)
        .ThenInclude(pcComp => pcComp.Component)
        .FirstOrDefaultAsync(pc => pc.Id == PcId);
        }
        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }

    }
}
