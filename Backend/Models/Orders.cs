namespace EMedicineBE.Models
{
    public class Orders
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public string? OrderNo { get; set; }
        public decimal OrderTotal { get; set; }
        public string? OrderStatus { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CustomerName { get; set; }
        public DateTime? StatusDate { get; set; }
    }
}
