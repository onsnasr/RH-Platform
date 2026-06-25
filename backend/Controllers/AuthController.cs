using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RHPlatform.API.Models;
using RHPlatform.API.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RHPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MongoDbService _db;
        private readonly IConfiguration _config;

        public AuthController(MongoDbService db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existing = await _db.Users.Find(u => u.Username == dto.Username).FirstOrDefaultAsync();
            if (existing != null)
                return BadRequest("Username already exists");

            var user = new User
            {
                EmployeeId = dto.EmployeeId,
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role
            };

            await _db.Users.InsertOneAsync(user);
            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users.Find(u => u.Username == dto.Username).FirstOrDefaultAsync();
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = GenerateToken(user);
            return Ok(new { token, role = user.Role, userId = user.Id });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _db.Users.Find(_ => true).ToListAsync();
            var result = users.Select(u => new {
                u.Id,
                u.EmployeeId,
                u.Username,
                u.Role,
                u.CreatedAt
            });
            return Ok(result);
        }

        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id!),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(int.Parse(_config["Jwt:ExpiryInDays"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public record RegisterDto(string EmployeeId, string Username, string Password, UserRole Role);
    public record LoginDto(string Username, string Password);
}