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
    public class EmployeeController : ControllerBase
    {
        private readonly MongoDbService _db;

        public EmployeeController(MongoDbService db)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _db.Employees.Find(_ => true).ToListAsync();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var employee = await _db.Employees.Find(e => e.Id == id).FirstOrDefaultAsync();
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> Create([FromBody] Employee employee)
        {
            await _db.Employees.InsertOneAsync(employee);
            return Ok(employee);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> Update(string id, [FromBody] Employee updated)
        {
            var result = await _db.Employees.ReplaceOneAsync(e => e.Id == id, updated);
            if (result.MatchedCount == 0) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _db.Employees.DeleteOneAsync(e => e.Id == id);
            if (result.DeletedCount == 0) return NotFound();
            return Ok("Employee deleted");
        }
    }
}