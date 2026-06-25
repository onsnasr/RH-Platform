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
    public class DepartmentController : ControllerBase
    {
        private readonly MongoDbService _db;

        public DepartmentController(MongoDbService db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var departments = await _db.Departments.Find(_ => true).ToListAsync();
            return Ok(departments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var department = await _db.Departments.Find(d => d.Id == id).FirstOrDefaultAsync();
            if (department == null) return NotFound();
            return Ok(department);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> Create([FromBody] Department department)
        {
            await _db.Departments.InsertOneAsync(department);
            return Ok(department);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> Update(string id, [FromBody] Department updated)
        {
            var result = await _db.Departments.ReplaceOneAsync(d => d.Id == id, updated);
            if (result.MatchedCount == 0) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _db.Departments.DeleteOneAsync(d => d.Id == id);
            if (result.DeletedCount == 0) return NotFound();
            return Ok("Department deleted");
        }
    }
}