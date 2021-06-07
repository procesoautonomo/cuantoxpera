using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.UI.Entities;

namespace Web.UI.Services
{
    public static class FriendGeneratorHelper
    {
        private static readonly string[] FriendNames = new[]
        {
            "Mati", "Beth", "Sofi", "Mara", "Jorge", "Luis", "Noe", "David", "Juan", "James"
        };
        
        public static List<Friend> Generate()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new Friend
            {
                Id = index,
                Name = FriendNames[rng.Next(FriendNames.Length)],
                Amount = rng.Next(0, 5000),
                State = FriendState.Save,
            })
            .ToList();
        }
    }
}
