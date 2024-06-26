﻿// <auto-generated />
using System;
using FinanceService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinanceService.Migrations
{
    [DbContext(typeof(FinanceDbContext))]
    [Migration("20240425105857_InitDb")]
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

            modelBuilder.Entity("FinanceService.Entities.BalanceItem", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("Id");

                    b.Property<DateTime>("ActionDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("ActionDate");

                    b.Property<Guid?>("AuctionId")
                        .HasColumnType("uuid")
                        .HasColumnName("AuctionId");

                    b.Property<int>("Balance")
                        .HasPrecision(14, 2)
                        .HasColumnType("integer")
                        .HasColumnName("Balance");

                    b.Property<int>("Credit")
                        .HasPrecision(14, 2)
                        .HasColumnType("integer")
                        .HasColumnName("Credit");

                    b.Property<int>("Debit")
                        .HasPrecision(14, 2)
                        .HasColumnType("integer")
                        .HasColumnName("Debit");

                    b.Property<int>("Status")
                        .HasColumnType("integer")
                        .HasColumnName("Status");

                    b.Property<string>("UserLogin")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("UserLogin");

                    b.HasKey("Id")
                        .HasName("PK_Id");

                    b.HasIndex("ActionDate")
                        .HasDatabaseName("IX_FinanceService_ActionDate");

                    b.HasIndex("AuctionId")
                        .HasDatabaseName("IX_FinanceService_AuctionId");

                    b.HasIndex("Id")
                        .HasDatabaseName("PK_Items");

                    b.HasIndex("UserLogin")
                        .HasDatabaseName("IX_FinanceService_UserLogin");

                    b.ToTable("BalanceItems", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}
