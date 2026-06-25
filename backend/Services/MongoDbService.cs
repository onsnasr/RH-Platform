using MongoDB.Driver;
using RHPlatform.API.Models;

namespace RHPlatform.API.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;

        public MongoDbService(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDB:ConnectionString"]);
            _database = client.GetDatabase(config["MongoDB:DatabaseName"]);
        }

        public IMongoCollection<Employee> Employees =>
            _database.GetCollection<Employee>("Employees");

        public IMongoCollection<Department> Departments =>
            _database.GetCollection<Department>("Departments");

        public IMongoCollection<LeaveRequest> LeaveRequests =>
            _database.GetCollection<LeaveRequest>("LeaveRequests");

        public IMongoCollection<Payroll> Payrolls =>
            _database.GetCollection<Payroll>("Payrolls");

        public IMongoCollection<User> Users =>
            _database.GetCollection<User>("Users");
    }
}