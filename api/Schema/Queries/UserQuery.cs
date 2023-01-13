using api.DTOs;
using api.Services;

namespace api.Schema.Queries
{
    [ExtendObjectType("Query")]
    public class UserQuery
    {
        private readonly TimeInService _timeInService;
        public UserQuery(TimeInService timeInService)
        {
            _timeInService = timeInService;
        }
        public async Task<UserDTO?> GetUserById(string token, string schedule)
        {
            return await _timeInService.GetByIdSchedule(token, schedule);
        }
    }
}
