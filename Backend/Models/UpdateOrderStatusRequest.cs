namespace EMedicineBE.Models
{
    public class UpdateOrderStatusRequest
    {
        public int OrderID { get; set; }
        public string OrderStatus { get; set; }
    }
}
