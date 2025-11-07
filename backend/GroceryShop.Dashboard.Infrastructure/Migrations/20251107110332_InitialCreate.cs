using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GroceryShop.Dashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Shops",
                columns: table => new
                {
                    TenantId = table.Column<int>(type: "INTEGER", nullable: false),
                    ShopName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')"),
                    ModifiedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shops", x => x.TenantId);
                });

            migrationBuilder.CreateTable(
                name: "DailyRevenueSummaries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TenantId = table.Column<int>(type: "INTEGER", nullable: false),
                    Date = table.Column<DateTime>(type: "date", nullable: false),
                    DailyIncome = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DailyOutcome = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyRevenueSummaries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyRevenueSummaries_Shops_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Shops",
                        principalColumn: "TenantId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailyRevenueSummaries_TenantId_Date",
                table: "DailyRevenueSummaries",
                columns: new[] { "TenantId", "Date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Shops_IsActive",
                table: "Shops",
                column: "IsActive");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyRevenueSummaries");

            migrationBuilder.DropTable(
                name: "Shops");
        }
    }
}
