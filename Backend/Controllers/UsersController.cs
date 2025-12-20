using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using EMedicineBE.Models;
using System.Data;

namespace EMedicineBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public UsersController(IConfiguration configuration) { _configuration = configuration; }

        [HttpPost("registration")]
        public Response Registration([FromBody] Users users)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.register(users, con);
        }

        [HttpPost("login")]
        public Response Login([FromBody] LoginRequest request)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.login(request, con);
        }

        [HttpPost("viewUser")]
        public Response ViewUser([FromBody] Users u)
        {
            Response res = new Response();
            try
            {
                using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
                SqlDataAdapter da = new SqlDataAdapter("SELECT ID, FirstName, LastName, Email, Type, Status, CreatedOn FROM Users WHERE ID = @ID", con);
                da.SelectCommand.Parameters.AddWithValue("@ID", u.ID);
                DataTable dt = new DataTable();
                da.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    res.StatusCode = 200;
                    res.StatusMessage = "User retrieved";
                    res.user = new Users
                    {
                        ID = Convert.ToInt32(dt.Rows[0]["ID"]),
                        FirstName = dt.Rows[0]["FirstName"].ToString(),
                        LastName = dt.Rows[0]["LastName"].ToString(),
                        Email = dt.Rows[0]["Email"].ToString(),
                        Type = dt.Rows[0]["Type"].ToString(),
                        Status = Convert.ToInt32(dt.Rows[0]["Status"]),
                        CreatedOn = dt.Rows[0]["CreatedOn"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(dt.Rows[0]["CreatedOn"])
                    };
                }
                else { res.StatusCode = 100; res.StatusMessage = "User not found"; }
            }
            catch (Exception ex) { res.StatusCode = 500; res.StatusMessage = ex.Message; }
            return res;
        }

        [HttpPost("updateProfile")]
        public Response UpdateProfile([FromBody] Users u)
        {
            try
            {
                using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
                SqlCommand cmd = new SqlCommand("UPDATE Users SET FirstName=@FirstName, LastName=@LastName WHERE ID=@ID", con);
                cmd.Parameters.AddWithValue("@FirstName", u.FirstName ?? "");
                cmd.Parameters.AddWithValue("@LastName", u.LastName ?? "");
                cmd.Parameters.AddWithValue("@ID", u.ID);
                con.Open();
                int i = cmd.ExecuteNonQuery();
                con.Close();
                return new Response { StatusCode = i > 0 ? 200 : 100, StatusMessage = i > 0 ? "Profile updated" : "Update failed" };
            }
            catch (Exception ex) { return new Response { StatusCode = 500, StatusMessage = ex.Message }; }
        }

        [HttpPost("removeFromCart")]
        public Response RemoveFromCart([FromBody] Cart cart)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.removeFromCart(cart, con);
        }

        [HttpPost("cancelOrder")]
        public Response cancelOrder([FromBody] CancelOrderRequest req)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.cancelOrder(req.OrderID, con);
        }
    }
}
