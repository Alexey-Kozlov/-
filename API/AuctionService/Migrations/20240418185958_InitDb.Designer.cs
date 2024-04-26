﻿// <auto-generated />
using System;
using AuctionService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AuctionService.Migrations
{
    [DbContext(typeof(AuctionDbContext))]
    [Migration("20240418185958_InitDb")]
    partial class InitDb
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("AuctionService.Entities.Auction", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("Id");

                    b.Property<DateTime?>("AuctionEnd")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("AuctionEnd");

                    b.Property<DateTime>("CreateAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("CreateAt");

                    b.Property<int>("CurrentHighBid")
                        .HasColumnType("integer")
                        .HasColumnName("CurrentHighBid");

                    b.Property<int>("ReservePrice")
                        .HasColumnType("integer")
                        .HasColumnName("ReservePrice");

                    b.Property<string>("Seller")
                        .HasColumnType("text")
                        .HasColumnName("Seller");

                    b.Property<int>("SoldAmount")
                        .HasColumnType("integer")
                        .HasColumnName("SoldAmount");

                    b.Property<int>("Status")
                        .HasColumnType("integer")
                        .HasColumnName("Status");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("UpdatedAt");

                    b.Property<string>("Winner")
                        .HasColumnType("text")
                        .HasColumnName("Winner");

                    b.HasKey("Id")
                        .HasName("PK_AuctionId");

                    b.HasIndex("Id")
                        .HasDatabaseName("PK_Auctions");

                    b.ToTable("Auction", (string)null);
                });

            modelBuilder.Entity("AuctionService.Entities.Item", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("Id");

                    b.Property<Guid>("AuctionId")
                        .HasColumnType("uuid")
                        .HasColumnName("AuctionId");

                    b.Property<string>("Description")
                        .HasColumnType("text")
                        .HasColumnName("Description");

                    b.Property<string>("Properties")
                        .HasColumnType("text")
                        .HasColumnName("Properties");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("Title");

                    b.HasKey("Id")
                        .HasName("PK_ItemId");

                    b.HasIndex("AuctionId")
                        .HasDatabaseName("FK_Items_Auctions_AuctionId");

                    b.HasIndex("Id")
                        .HasDatabaseName("PK_Items");

                    b.ToTable("Items", (string)null);
                });

            modelBuilder.Entity("AuctionService.Entities.Item", b =>
                {
                    b.HasOne("AuctionService.Entities.Auction", "Auction")
                        .WithMany("Item")
                        .HasForeignKey("AuctionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Auction");
                });

            modelBuilder.Entity("AuctionService.Entities.Auction", b =>
                {
                    b.Navigation("Item");
                });
#pragma warning restore 612, 618
        }
    }
}