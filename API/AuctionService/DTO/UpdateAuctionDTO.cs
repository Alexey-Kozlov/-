﻿namespace AuctionService.DTO;

public class UpdateAuctionDTO
{
    public string Make { get; set; }
    public string Model { get; set; }
    public int? Year { get; set; }
    public string Color { get; set; }
    public int? Mileage { get; set; }
    public string Description { get; set; }
    public string Image { get; set; }
    public int ReservePrice { get; set; }
    public DateTime AuctionEnd { get; set; }
}
