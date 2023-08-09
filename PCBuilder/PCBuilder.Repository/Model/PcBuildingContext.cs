using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace PCBuilder.Repository.Model;

public partial class PcBuildingContext : DbContext
{
    public PcBuildingContext()
    {
    }

    public PcBuildingContext(DbContextOptions<PcBuildingContext> options)
        : base(options)
    {
    }
    private readonly IConfiguration _configuration;

    public PcBuildingContext(DbContextOptions<PcBuildingContext> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;
    }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Compatibility> Compatibilities { get; set; }

    public virtual DbSet<Component> Components { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Pc> Pcs { get; set; }

    public virtual DbSet<PcComponent> PcComponents { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        //        => optionsBuilder.UseSqlServer(S);
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(_configuration.GetConnectionString("ConnectionString"));
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Brand__3214EC07BF19E4E6");

            entity.ToTable("Brand");

            entity.Property(e => e.Logo)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Origin)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Category__3214EC0728D76485");

            entity.ToTable("Category");

            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.Brand).WithMany(p => p.Categories)
                .HasForeignKey(d => d.BrandId)
                .HasConstraintName("FK__Category__BrandI__70DDC3D8");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK__Category__Parent__6FE99F9F");
        });

        modelBuilder.Entity<Compatibility>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Compatib__3214EC07F8BA2053");

            entity.ToTable("Compatibility");

            entity.Property(e => e.Category01Id).HasColumnName("Category01_ID");
            entity.Property(e => e.Category02Id).HasColumnName("Category02_ID");

            entity.HasOne(d => d.Category01).WithMany(p => p.CompatibilityCategory01s)
                .HasForeignKey(d => d.Category01Id)
                .HasConstraintName("FK__Compatibi__Categ__73BA3083");

            entity.HasOne(d => d.Category02).WithMany(p => p.CompatibilityCategory02s)
                .HasForeignKey(d => d.Category02Id)
                .HasConstraintName("FK__Compatibi__Categ__74AE54BC");
        });

        modelBuilder.Entity<Component>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Componen__3214EC076FF4B26E");

            entity.ToTable("Component");

            entity.Property(e => e.Description).HasMaxLength(4000);
            entity.Property(e => e.Image)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Summary).HasMaxLength(500);

            entity.HasOne(d => d.Brand).WithMany(p => p.Components)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Component__Brand__778AC167");

            entity.HasOne(d => d.Category).WithMany(p => p.Components)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Component__Categ__787EE5A0");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Order__3214EC07957A5A16");

            entity.ToTable("Order");

            entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.OrderDate).HasColumnType("date");
            entity.Property(e => e.StatusId)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Payment).WithMany(p => p.Orders)
                .HasForeignKey(d => d.PaymentId)
                .HasConstraintName("FK__Order__PaymentId__6B24EA82");

            entity.HasOne(d => d.Pc).WithMany(p => p.Orders)
                .HasForeignKey(d => d.PcId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order__PcId__693CA210");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order__UserId__6A30C649");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Payment__3214EC076B4DA7F2");

            entity.ToTable("Payment");

            entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.PaymentMode)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.PaymentTime)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Pc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PC__3214EC07DD05A3A4");

            entity.ToTable("PC");

            entity.Property(e => e.Description).HasMaxLength(4000);
            entity.Property(e => e.Detail).HasMaxLength(2000);
            entity.Property(e => e.Discount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Image)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Summary).HasMaxLength(500);
            entity.Property(e => e.TemplateId).HasColumnName("TemplateID");

            entity.HasOne(d => d.DesignByNavigation).WithMany(p => p.Pcs)
                .HasForeignKey(d => d.DesignBy)
                .HasConstraintName("FK__PC__DesignBy__628FA481");

            entity.HasOne(d => d.Template).WithMany(p => p.InverseTemplate)
                .HasForeignKey(d => d.TemplateId)
                .HasConstraintName("FK__PC__TemplateID__619B8048");
        });

        modelBuilder.Entity<PcComponent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PC_Compo__3214EC070994C8B5");

            entity.ToTable("PC_Component");

            entity.HasOne(d => d.Component).WithMany(p => p.PcComponents)
                .HasForeignKey(d => d.ComponentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PC_Compon__Compo__7C4F7684");

            entity.HasOne(d => d.Pc).WithMany(p => p.PcComponents)
                .HasForeignKey(d => d.PcId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PC_Compone__PcId__7B5B524B");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Role__3214EC07218804A0");

            entity.ToTable("Role");

            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__User__3214EC07A9E0B13F");

            entity.ToTable("User");

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.Avatar)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Fullname).HasMaxLength(100);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__User__RoleID__5EBF139D");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
