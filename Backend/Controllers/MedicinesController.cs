using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using EMedicineBE.Models;

namespace EMedicineBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public MedicinesController(IConfiguration configuration) { _configuration = configuration; }

        [HttpGet("medicineList")]
        public Response MedicineList()
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.medicineList(con);
        }

        [HttpPost("addToCart")]
        public Response AddToCart([FromBody] Cart cart)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.addToCart(cart, con);
        }

        [HttpPost("cartList")]
        public Response CartList([FromBody] Users user)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.cartList(user, con);
        }

        [HttpPost("placeOrder")]
        public Response PlaceOrder([FromBody] Users user)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.placeOrder(user, con);
        }

        [HttpPost("orderList")]
        public Response OrderList([FromBody] Users user)
        {
            DAL dal = new DAL();
            using SqlConnection con = new SqlConnection(_configuration.GetConnectionString("EMesCS"));
            return dal.orderList(user, con);
        }
    }
}
