using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eatzie.Models;

public class FoodCategoryEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<FoodCategoryItemEntity> FoodCategoryItems { get; set; } = new List<FoodCategoryItemEntity>();
}