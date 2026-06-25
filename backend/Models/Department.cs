using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RHPlatform.API.Models
{
    public class Department
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string HRId { get; set; } = string.Empty;
    }
}