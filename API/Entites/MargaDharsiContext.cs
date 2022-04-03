using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace API.Entites
{
    public partial class MargaDharsiContext : DbContext
    {
        public MargaDharsiContext()
        {
        }

        public MargaDharsiContext(DbContextOptions<MargaDharsiContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AirportsList> AirportsLists { get; set; }
        public virtual DbSet<AirportsListTest> AirportsListTests { get; set; }
        public virtual DbSet<CountriesTest> CountriesTests { get; set; }
        public virtual DbSet<Country> Countries { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=MargaDharsi;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AirportsList>(entity =>
            {
                entity.ToTable("AirportsList");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Airport)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Country)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Iatacode)
                    .IsRequired()
                    .HasMaxLength(3)
                    .HasColumnName("IATACode");

                entity.Property(e => e.Icaocode)
                    .IsRequired()
                    .HasMaxLength(4)
                    .HasColumnName("ICAOCode")
                    .IsFixedLength();
            });

            modelBuilder.Entity<AirportsListTest>(entity =>
            {
                entity.ToTable("AirportsList_test");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Airport)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Country)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Iatacode)
                    .IsRequired()
                    .HasMaxLength(3)
                    .HasColumnName("IATACode");

                entity.Property(e => e.Icaocode)
                    .IsRequired()
                    .HasMaxLength(4)
                    .HasColumnName("ICAOCode")
                    .IsFixedLength();
            });

            modelBuilder.Entity<CountriesTest>(entity =>
            {
                entity.ToTable("countries_test");

                entity.HasIndex(e => e.Country, "UQ__countrie__067B30092210FFFC")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Country).HasMaxLength(150);
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.ToTable("countries");

                entity.HasIndex(e => e.Country1, "UQ__countrie__067B3009D934E5C4")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Country1)
                    .HasMaxLength(150)
                    .HasColumnName("Country");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
