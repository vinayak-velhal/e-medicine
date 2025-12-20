using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using EMedicineBE.Models;

namespace EMedicineBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public AdminController(IConfiguration configuration) { _configuration = configuration; }

        [HttpGet("userList")]
        public Response UserList()
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.userList(con);
        }

        [HttpPost("addUpdateMedicine")]
        public Response AddUpdateMedicine([FromBody] Medicines med)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.addUpdateMedicine(med, con);
        }

        [HttpPost("updateOrderStatus")]
        public Response updateOrderStatus([FromBody] UpdateOrderStatusRequest req)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.updateOrderStatus(req.OrderID, req.OrderStatus, con);
        }

        // Provide Delete medicine endpoint
        [HttpPost("deleteMedicine")]
        public Response DeleteMedicine([FromBody] Medicines med)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.deleteMedicine(med, con);
        }
    }
}
