﻿using Contracts;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using SearchService.Data;

namespace SearchService.Consumers;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    private readonly SearchDbContext _context;

    public AuctionFinishedConsumer(SearchDbContext context)
    {
        _context = context;
    }
    public async Task Consume(ConsumeContext<AuctionFinished> consumeContext)
    {
        var auction = await _context.Items.FirstOrDefaultAsync(p => p.Id == consumeContext.Message.AuctionId);
        if (auction != null)
        {
            if (consumeContext.Message.ItemSold)
            {
                auction.Winner = consumeContext.Message.Winner;
                auction.SoldAmount = consumeContext.Message.Amount ?? 0;
            }
            auction.Status = "Finished";
            await _context.SaveChangesAsync();
            Console.WriteLine("--> Получение сообщения - аукцион завершен");
            return;
        }
        Console.WriteLine("Ошибка завершения аукциона " + auction.Id);
    }
}
