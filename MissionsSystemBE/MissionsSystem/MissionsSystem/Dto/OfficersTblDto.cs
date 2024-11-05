namespace MissionsSystem.Dto
{
    public class OfficersTblDto
    {
        public int Id { get; set; }

        public string Rank { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string? MilitaryNo { get; set; }

        public string? Phone { get; set; }
    }
}
