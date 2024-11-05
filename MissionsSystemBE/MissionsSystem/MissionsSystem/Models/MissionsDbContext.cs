using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MissionsSystem.Models;

public partial class MissionsDbContext : DbContext
{
    public MissionsDbContext()
    {
    }

    public MissionsDbContext(DbContextOptions<MissionsDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AuthenticationsTbl> AuthenticationsTbls { get; set; }

    public virtual DbSet<MissionTbl> MissionTbls { get; set; }

    public virtual DbSet<OfficersTbl> OfficersTbls { get; set; }

    public virtual DbSet<PerMission> PerMissions { get; set; }

    public virtual DbSet<UserHistory> UserHistories { get; set; }

    public virtual DbSet<UsersTbl> UsersTbls { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=192.168.1.252;Database=MissionsDB;TrustServerCertificate=True;User ID=sa;Password=Admin123");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuthenticationsTbl>(entity =>
        {
            entity
                .HasKey(e => e.UserId);
            entity
                .ToTable("AUTHENTICATIONS_TBL");

            entity.Property(e => e.AddAuths)
                .HasDefaultValueSql("('0')")
                .HasColumnName("ADD_AUTHS");
            entity.Property(e => e.AddMember)
                .HasDefaultValueSql("('0')")
                .HasColumnName("ADD_MEMBER");
            entity.Property(e => e.AddMission)
                .HasDefaultValueSql("('0')")
                .HasColumnName("ADD_MISSION");
            entity.Property(e => e.AddNewUser)
                .HasDefaultValueSql("('0')")
                .HasColumnName("ADD_NEW_USER");
            entity.Property(e => e.DeleteMission)
                .HasDefaultValueSql("('0')")
                .HasColumnName("DELETE_MISSION");
            entity.Property(e => e.EditMission)
                .HasDefaultValueSql("('0')")
                .HasColumnName("EDIT_MISSION");
            entity.Property(e => e.OpenHistory)
                .HasDefaultValueSql("('0')")
                .HasColumnName("OPEN_HISTORY");
            entity.Property(e => e.OpenSettings)
                .HasDefaultValueSql("('0')")
                .HasColumnName("OPEN_SETTINGS");
            entity.Property(e => e.PersonalReview)
                .HasDefaultValueSql("('0')")
                .HasColumnName("PERSONAL_REVIEW");
            entity.Property(e => e.ResetPassword)
                .HasDefaultValueSql("('0')")
                .HasColumnName("RESET_PASSWORD");
            entity.Property(e => e.SetAdmin)
                .HasDefaultValueSql("('0')")
                .HasColumnName("SET_ADMIN");
            entity.Property(e => e.UserId).HasColumnName("USER_ID");

            entity.HasOne(d => d.User).WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AUTHENTIC__USER___2DE6D218");
        });

        modelBuilder.Entity<MissionTbl>(entity =>
        {
            entity.HasKey(e => e.MissionId);

            entity.ToTable("MISSION_TBL");

            entity.Property(e => e.MissionId).HasColumnName("MISSION_ID");
            entity.Property(e => e.Dist).HasColumnName("DIST");
            entity.Property(e => e.Done).HasColumnName("DONE");
            entity.Property(e => e.FromDate)
                .HasColumnType("date")
                .HasColumnName("FROM_DATE");
            entity.Property(e => e.FromTime)
                .HasMaxLength(50)
                .HasColumnName("FROM_TIME");
            entity.Property(e => e.MissionCode)
                .HasMaxLength(50)
                .HasColumnName("MISSION_CODE");
            entity.Property(e => e.Notice)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("NOTICE");
            entity.Property(e => e.OffsNo)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("OFFS_NO");
            entity.Property(e => e.PersRev).HasColumnName("PERS_REV");
            entity.Property(e => e.Reason).HasColumnName("REASON");
            entity.Property(e => e.StatNo)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("STAT_NO");
            entity.Property(e => e.State).HasColumnName("STATE");
            entity.Property(e => e.personalReviewer).HasColumnName("PERSONAL_REVIEWER");
            entity.Property(e => e.ToDate)
                .HasColumnType("date")
                .HasColumnName("TO_DATE");
            entity.Property(e => e.ToTime)
                .HasMaxLength(50)
                .HasColumnName("TO_TIME");
        });

        modelBuilder.Entity<OfficersTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tmp_ms_x__3214EC27E2A0E2E0");

            entity.ToTable("OFFICERS_TBL");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.MilitaryNo)
                .HasMaxLength(50)
                .HasColumnName("MILITARY_NO");
            entity.Property(e => e.Name)
                .HasColumnType("ntext")
                .HasColumnName("NAME");
            entity.Property(e => e.Phone)
                .HasMaxLength(15)
                .IsFixedLength()
                .HasColumnName("PHONE");
            entity.Property(e => e.Rank)
                .HasMaxLength(10)
                .IsFixedLength();
        });

        modelBuilder.Entity<PerMission>(entity =>
        {
            entity.HasKey(e => new { e.MissionId, e.OfficersId });

            entity.ToTable("PER_MISSION");

            entity.Property(e => e.MissionId).HasColumnName("MISSION_ID");
            entity.Property(e => e.OfficersId).HasColumnName("OFFICERS_ID");

            entity.HasOne(d => d.Mission).WithMany(p => p.PerMissions)
                .HasForeignKey(d => d.MissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PER_MISSION_MISSION_TBL");

            entity.HasOne(d => d.Officers).WithMany(p => p.PerMissions)
                .HasForeignKey(d => d.OfficersId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PER_MISSION_OFFICERS_TBL");
        });

        modelBuilder.Entity<UserHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__USER_HIS__3214EC27427C9D5D");

            entity.ToTable("USER_HISTORY");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Action)
                .HasMaxLength(200)
                .HasColumnName("ACTION");
            entity.Property(e => e.DateTime)
                .HasColumnType("datetime")
                .HasColumnName("DATE_TIME");
            entity.Property(e => e.UserId).HasColumnName("USER_ID");
        });

        modelBuilder.Entity<UsersTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tmp_ms_x__3214EC27EA873E28");

            entity.ToTable("USERS_TBL");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("NAME");
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasColumnName("PASSWORD");
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .HasColumnName("USER_NAME");
            entity.Property(e => e.Hash).HasColumnName("HASH");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
