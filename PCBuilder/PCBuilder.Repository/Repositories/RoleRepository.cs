using Microsoft.EntityFrameworkCore;
using PCBuilder.Repository.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.Repository.Repository
{
    public interface IRoleRepository
    {
        Task<Role> GetRoleByIdAsync(int roleId);
    }
    public class RoleRepository : IRoleRepository
    {
        private readonly PcBuildingContext _dataContext;
        public RoleRepository(PcBuildingContext context)
        {
            _dataContext = context;
        }
        public async Task<Role> GetRoleByIdAsync(int roleId)
        {

            var role = await _dataContext.Roles.FindAsync(roleId);

            return role;
        }


    }
}
