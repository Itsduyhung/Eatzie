using System.ComponentModel.DataAnnotations;
using Eatzie.Enum;

namespace Eatzie.DTOs.Request
{
    public class DietTypeRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [EnumDataType(typeof(DietTypeEnum))]
        public DietTypeEnum DietType { get; set; }
    }
}