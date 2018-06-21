using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SID.Common.Model.Infrastructure
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Nickname { get; set; }
        public string Suffix { get; set; }

        [Required]
        public byte Level { get; set; }

        [Required]
        public DateTime JoinDate { get; set; }

        public string Title { get; set; }
        public string EmailSignature { get; set; }
        public string Photo { get; set; }
        public string ProfilePicture { get; set; }
        public string ProfileIsVisible { get; set; }
        public string UserLanguagekey { get; set; }
        public string EnableMobileApp { get; set; }
        public string EnableOfflineUser { get; set; }
        public string Status { get; set; }

        public bool IsDeleted { get; set; }
        public bool IsFrozen { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }



    }

}