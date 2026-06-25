using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RHPlatform.API.Models
{
    public class Payroll
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal BaseSalary { get; set; }
        public decimal Bonus { get; set; }
        public decimal Deductions { get; set; }
        public decimal GetNetSalary() => BaseSalary + Bonus - Deductions;
    }
}