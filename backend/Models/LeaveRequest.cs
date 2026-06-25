using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RHPlatform.API.Models
{
    public enum LeaveStatus { Pending, Approved, Rejected }

    public class LeaveRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public LeaveStatus Status { get; set; } = LeaveStatus.Pending;
        public string ApprovedBy { get; set; } = string.Empty;
    }
}