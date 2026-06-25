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
    public class LeaveRequestController : ControllerBase
    {
        private readonly MongoDbService _db;

        public LeaveRequestController(MongoDbService db)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> GetAll()
        {
            var requests = await _db.LeaveRequests.Find(_ => true).ToListAsync();
            return Ok(requests);
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetByEmployee(string employeeId)
        {
            var requests = await _db.LeaveRequests.Find(r => r.EmployeeId == employeeId).ToListAsync();
            return Ok(requests);
        }

        [HttpPost]
        [Authorize(Roles = "Employee,HR,SuperAdmin")]
        public async Task<IActionResult> Submit([FromBody] LeaveRequest request)
        {
            request.Status = LeaveStatus.Pending;
            await _db.LeaveRequests.InsertOneAsync(request);
            return Ok(request);
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> Approve(string id)
        {
            var update = Builders<LeaveRequest>.Update.Set(r => r.Status, LeaveStatus.Approved);
            var result = await _db.LeaveRequests.UpdateOneAsync(r => r.Id == id, update);
            if (result.MatchedCount == 0) return NotFound();
            return Ok("Leave request approved");
        }

        [HttpPut("{id}/reject")]
        [Authorize(Roles = "SuperAdmin,HR")]
        public async Task<IActionResult> Reject(string id)
        {
            var update = Builders<LeaveRequest>.Update.Set(r => r.Status, LeaveStatus.Rejected);
            var result = await _db.LeaveRequests.UpdateOneAsync(r => r.Id == id, update);
            if (result.MatchedCount == 0) return NotFound();
            return Ok("Leave request rejected");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _db.LeaveRequests.DeleteOneAsync(r => r.Id == id);
            if (result.DeletedCount == 0) return NotFound();
            return Ok("Leave request deleted");
        }
    }
}