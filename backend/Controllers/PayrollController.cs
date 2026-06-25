using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RHPlatform.API.Models;
using RHPlatform.API.Services;

namespace RHPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PayrollController : ControllerBase
    {
        private readonly MongoDbService _db;

        public PayrollController(MongoDbService db)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> GetAll()
        {
            var payrolls = await _db.Payrolls.Find(_ => true).ToListAsync();
            return Ok(payrolls);
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetByEmployee(string employeeId)
        {
            var payrolls = await _db.Payrolls.Find(p => p.EmployeeId == employeeId).ToListAsync();
            return Ok(payrolls);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> Generate([FromBody] Payroll payroll)
        {
            await _db.Payrolls.InsertOneAsync(payroll);
            return Ok(payroll);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> Update(string id, [FromBody] Payroll updated)
        {
            var result = await _db.Payrolls.ReplaceOneAsync(p => p.Id == id, updated);
            if (result.MatchedCount == 0) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _db.Payrolls.DeleteOneAsync(p => p.Id == id);
            if (result.DeletedCount == 0) return NotFound();
            return Ok("Payroll deleted");
        }
    }
}