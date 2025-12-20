using Microsoft.Data.SqlClient;
using System.Data;

namespace EMedicineBE.Models
{
    public class DAL
    {
        public Response register(Users users, SqlConnection con)
        {
            Response resp = new Response();
            try
            {
                SqlCommand cmd = new SqlCommand("sp_register", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@FirstName", users.FirstName ?? "");
                cmd.Parameters.AddWithValue("@LastName", users.LastName ?? "");
                cmd.Parameters.AddWithValue("@Password", users.Password ?? "");
                cmd.Parameters.AddWithValue("@Email", users.Email ?? "");
                cmd.Parameters.AddWithValue("@Type", users.Type ?? "Users");
                cmd.Parameters.AddWithValue("@Status", users.Status);
                con.Open();
                var newId = cmd.ExecuteScalar();
                con.Close();
                resp.StatusCode = 200;
                resp.StatusMessage = "Registered";
            }
            catch (Exception ex)
            {
                resp.StatusCode = 500;
                resp.StatusMessage = ex.Message;
            }
            return resp;
        }

        public Response login(LoginRequest request, SqlConnection con)
        {
            Response response = new Response();
            try
            {
                SqlDataAdapter da = new SqlDataAdapter("sp_login", con);
                da.SelectCommand.CommandType = CommandType.StoredProcedure;
                da.SelectCommand.Parameters.AddWithValue("@Email", request.Email ?? "");
                da.SelectCommand.Parameters.AddWithValue("@Password", request.Password ?? "");

                DataTable dt = new DataTable();
                da.Fill(dt);

                if (dt.Rows.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Login successful";
                    response.user = new Users
                    {
                        ID = Convert.ToInt32(dt.Rows[0]["ID"]),
                        FirstName = dt.Rows[0]["FirstName"].ToString(),
                        LastName = dt.Rows[0]["LastName"].ToString(),
                        Email = dt.Rows[0]["Email"].ToString(),
                        Type = dt.Rows[0]["Type"].ToString(),
                        Status = Convert.ToInt32(dt.Rows[0]["Status"])
                    };
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Invalid email or password";
                    response.user = null;
                }
            }
            catch (Exception ex)
            {
                response.StatusCode = 500;
                response.StatusMessage = ex.Message;
                response.user = null;
            }
            return response;
        }

        public Response medicineList(SqlConnection con)
        {
            Response res = new Response();
            try
            {
                List<Medicines> list = new List<Medicines>();
                SqlDataAdapter da = new SqlDataAdapter("sp_MedicineList", con);
                da.SelectCommand.CommandType = CommandType.StoredProcedure;
                DataTable dt = new DataTable();
                da.Fill(dt);
                foreach (DataRow r in dt.Rows)
                {
                    list.Add(new Medicines
                    {
                        ID = Convert.ToInt32(r["ID"]),
                        Name = r["Name"].ToString(),
                        Manufacturer = r["Manufacturer"].ToString(),
                        UnitPrice = Convert.ToDecimal(r["UnitPrice"]),
                        Discount = Convert.ToDecimal(r["Discount"]),
                        Quantity = Convert.ToInt32(r["Quantity"]),
                        ExpDate = r["ExpDate"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(r["ExpDate"]),
                        ImageUrl = r["ImageUrl"] == DBNull.Value ? null : r["ImageUrl"].ToString(),
                        Status = Convert.ToInt32(r["Status"])
                    });
                }
                res.StatusCode = 200;
                res.StatusMessage = "Medicines retrieved";
                res.listMedicines = list;
            }
            catch (Exception ex)
            {
                res.StatusCode = 500;
                res.StatusMessage = ex.Message;
            }
            return res;
        }

        public Response addToCart(Cart c, SqlConnection con)
        {
            Response res = new Response();
            try
            {
                SqlCommand cmd = new SqlCommand("sp_AddToCart", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", c.UserId);
                cmd.Parameters.AddWithValue("@MedicineID", c.MedicineID);
                cmd.Parameters.AddWithValue("@UnitPrice", c.UnitPrice);
                cmd.Parameters.AddWithValue("@Discount", c.Discount);
                cmd.Parameters.AddWithValue("@Quantity", c.Quantity);
                cmd.Parameters.AddWithValue("@TotalPrice", c.TotalPrice);
                con.Open();
                var execResult = cmd.ExecuteScalar();
                con.Close();

                res.StatusCode = 200;
                res.StatusMessage = "Added to cart";
            }
            catch (Exception ex)
            {
                res.StatusCode = 500;
                res.StatusMessage = ex.Message;
            }
            return res;
        }

        public Response cartList(Users user, SqlConnection con)
        {
            Response res = new Response();
            try
            {
                SqlDataAdapter da = new SqlDataAdapter("sp_GetCartByUser", con);
                da.SelectCommand.CommandType = CommandType.StoredProcedure;
                da.SelectCommand.Parameters.AddWithValue("@UserId", user.ID);
                DataTable dt = new DataTable();
                da.Fill(dt);
                List<Cart> list = new List<Cart>();
                foreach (DataRow r in dt.Rows)
                {
                    list.Add(new Cart
                    {
                        ID = Convert.ToInt32(r["ID"]),
                        UserId = Convert.ToInt32(r["UserId"]),
                        MedicineID = Convert.ToInt32(r["MedicineID"]),
                        MedicineName = r["MedicineName"].ToString(),
                        UnitPrice = Convert.ToDecimal(r["UnitPrice"]),
                        Discount = Convert.ToDecimal(r["Discount"]),
                        Quantity = Convert.ToInt32(r["Quantity"]),
                        TotalPrice = Convert.ToDecimal(r["TotalPrice"])
                    });
                }
                res.StatusCode = 200;
                res.StatusMessage = "Cart retrieved";
                res.listCart = list;
            }
            catch (Exception ex)
            {
                res.StatusCode = 500;
                res.StatusMessage = ex.Message;
            }
            return res;
        }

        public Response removeFromCart(Cart cart, SqlConnection con)
        {
            Response response = new Response();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_removeFromCart", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@CartID", cart.ID);
                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                    con.Close();
                    response.StatusCode = rows > 0 ? 200 : 100;
                    response.StatusMessage = rows > 0 ? "Removed from cart" : "Item not found";
                }
            }
            catch (Exception ex)
            {
                response.StatusCode = 500;
                response.StatusMessage = ex.Message;
            }
            return response;
        }

        public Response placeOrder(Users user, SqlConnection con)
        {
            Response res = new Response();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_PlaceOrder", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserID", user.ID);
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    adapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        res.StatusCode = 200;
                        res.StatusMessage = "Order placed";
                    }
                    else
                    {
                        res.StatusCode = 100;
                        res.StatusMessage = "Cart is empty or failed";
                    }
                }
            }
            catch (Exception ex)
            {
                res.StatusCode = 500;
                res.StatusMessage = ex.Message;
            }
            return res;
        }

        public Response orderList(Users user, SqlConnection con)
        {
            Response res = new Response();
            try
            {
                SqlDataAdapter da = new SqlDataAdapter("sp_OrderList", con);
                da.SelectCommand.CommandType = CommandType.StoredProcedure;
                da.SelectCommand.Parameters.AddWithValue("@Type", user.Type ?? "User");
                da.SelectCommand.Parameters.AddWithValue("@ID", user.ID);
                DataTable dt = new DataTable();
                da.Fill(dt);

                List<Orders> list = new List<Orders>();
                foreach (DataRow r in dt.Rows)
                {
                    list.Add(new Orders
                    {
                        ID = Convert.ToInt32(r["ID"]),
                        UserID = Convert.ToInt32(r["UserID"]),
                        OrderNo = r["OrderNo"].ToString(),
                        OrderTotal = Convert.ToDecimal(r["OrderTotal"]),
                        OrderStatus = r["OrderStatus"].ToString(),
                        CreatedOn = Convert.ToDateTime(r["CreatedOn"]),
                        CustomerName = r.Table.Columns.Contains("CustomerName") ? r["CustomerName"].ToString() : "",
                        StatusDate = r["StatusDate"] == DBNull.Value
                        ? null
                        : Convert.ToDateTime(r["StatusDate"]),
                    });
                }

                res.StatusCode = 200;
                res.StatusMessage = "Orders retrieved";
                res.listOrders = list;
            }
            catch (Exception ex)
            {
                res.StatusCode = 500;
                res.StatusMessage = ex.Message;
            }
            return res;
        }

        public Response userList(SqlConnection con)
        {
            Response res = new Response();
            try
            {
                SqlDataAdapter da = new SqlDataAdapter("sp_UserList", con);
                da.SelectCommand.CommandType = CommandType.StoredProcedure;
                DataTable dt = new DataTable();
                da.Fill(dt);
                List<Users> list = new List<Users>();
                foreach (DataRow r in dt.Rows)
                {
                    list.Add(new Users
                    {
                        ID = Convert.ToInt32(r["ID"]),
                        FirstName = r["FirstName"].ToString(),
                        LastName = r["LastName"].ToString(),
                        Email = r["Email"].ToString(),
                        Type = r["Type"].ToString(),
                        Status = Convert.ToInt32(r["Status"]),
                        CreatedOn = r["CreatedOn"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(r["CreatedOn"])
                    });
                }
                res.StatusCode = 200;
                res.StatusMessage = "Users retrieved";
                res.listUsers = list;
            }
            catch (Exception ex)
            {
                res.StatusCode = 500;
                res.StatusMessage = ex.Message;
            }
            return res;
        }

        public Response addUpdateMedicine(Medicines med, SqlConnection con)
        {
            Response res = new Response();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_AddUpdateMedicine", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", med.ID);
                    cmd.Parameters.AddWithValue("@Name", med.Name ?? "");
                    cmd.Parameters.AddWithValue("@Manufacturer", med.Manufacturer ?? "");
                    cmd.Parameters.AddWithValue("@UnitPrice", med.UnitPrice);
                    cmd.Parameters.AddWithValue("@Discount", med.Discount);
                    cmd.Parameters.AddWithValue("@Quantity", med.Quantity);
                    cmd.Parameters.AddWithValue("@ExpDate", med.ExpDate.HasValue ? (object)med.ExpDate.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@ImageUrl", med.ImageUrl ?? "");
                    cmd.Parameters.AddWithValue("@Status", med.Status);
                    con.Open();
                    var ret = cmd.ExecuteScalar();
                    con.Close();
                    res.StatusCode = 200;
                    res.StatusMessage = "Medicine saved/updated";
                }
            }
            catch (Exception ex)
            {
                res.StatusCode = 500;
                res.StatusMessage = ex.Message;
            }
            return res;
        }

        public Response updateOrderStatus(int orderId, string newStatus, SqlConnection con)
        {
            Response res = new Response();
            try
            {
                SqlCommand cmd = new SqlCommand("sp_updateOrderStatus", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@OrderID", orderId);
                cmd.Parameters.AddWithValue("@Status", newStatus);

                con.Open();
                int rows = Convert.ToInt32(cmd.ExecuteScalar());
                con.Close();

                if (rows > 0)
                {
                    res.StatusCode = 200;
                    res.StatusMessage = "Order status updated successfully";
                }
                else
                {
                    res.StatusCode = 100;
                    res.StatusMessage = "Invalid status transition or order not found";
                }
            }
            catch (Exception ex)
            {
                res.StatusCode = 500;
                res.StatusMessage = ex.Message;
            }

            return res;
        }

        public Response cancelOrder(int orderId, SqlConnection con)
        {
            Response res = new Response();
            try
            {
                SqlCommand cmd = new SqlCommand("sp_cancelOrder", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@OrderID", orderId);

                con.Open();
                int rows = Convert.ToInt32(cmd.ExecuteScalar());
                con.Close();

                if (rows > 0)
                {
                    res.StatusCode = 200;
                    res.StatusMessage = "Order cancelled successfully";
                }
                else
                {
                    res.StatusCode = 100;
                    res.StatusMessage = "Unable to cancel — order may not be pending";
                }
            }
            catch (Exception ex)
            {
                res.StatusCode = 500;
                res.StatusMessage = ex.Message;
            }

            return res;
        }

        public Response deleteMedicine(Medicines med, SqlConnection con)
        {
            Response res = new Response();
            try
            {
                using (SqlCommand cmd = new SqlCommand("DELETE FROM dbo.Medicines WHERE ID = @ID", con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@ID", med.ID);
                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                    con.Close();
                    res.StatusCode = rows > 0 ? 200 : 100;
                    res.StatusMessage = rows > 0 ? "Medicine deleted" : "Not found";
                }
            }
            catch (Exception ex)
            {
                res.StatusCode = 500;
                res.StatusMessage = ex.Message;
            }
            return res;
        }
    }
}
