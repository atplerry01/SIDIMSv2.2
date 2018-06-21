using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.DataHandler.Encoder;
using SID.Common.Model.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace AuthorizationServer.Api.Infrastructure
{
    public class AuthRepository : IDisposable
    {
        private ApplicationDbContext _ctx;
        private UserManager<IdentityUser> _userManager;

        public AuthRepository()
        {
            _ctx = new ApplicationDbContext();
            _userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(_ctx));
        }
        
        #region Audience#Region
        // Audience Sections
        public Audience AddAudience(string name)
        {
            var existingAudience = _ctx.Audiences.Where(r => r.Name == name).SingleOrDefault();

            if (existingAudience != null)
            {
                //var result = await RemoveRefreshToken(existingToken);
            }

            var clientId = Guid.NewGuid().ToString("N");

            var key = new byte[32];
            RNGCryptoServiceProvider.Create().GetBytes(key);
            var base64Secret = TextEncodings.Base64Url.Encode(key);

            Audience newAudience = new Audience { ClientId = clientId, Base64Secret = base64Secret, Name = name };

            //_ctx.Audiences.Add(newAudience);

            return newAudience;
        }

        //Find Audience
        public Audience FindAudience(string clientId)
        {
            var audienceExist = _ctx.Audiences.Where(a => a.ClientId == clientId).SingleOrDefault();

            if (audienceExist != null)
            {
                return _ctx.Audiences.Find(clientId);
            }

            return null;

        }

        #endregion

        #region RefreshToken Region
        // Refresh Token Resources
        ///////////////////////////
        public Client FindClient(string clientId)
        {
            var client = _ctx.Clients.Find(clientId);

            return client;
        }

        public async Task<bool> AddRefreshToken(RefreshToken token)
        {
            var existingToken = _ctx.RefreshTokens.Where(r => r.Subject == token.Subject && r.ClientId == token.ClientId).SingleOrDefault();

            if (existingToken != null)
            {
                var result = await RemoveRefreshToken(existingToken);
            }

            _ctx.RefreshTokens.Add(token);

            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveRefreshToken(string refreshTokenId)
        {
            var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

            if (refreshToken != null)
            {
                _ctx.RefreshTokens.Remove(refreshToken);
                return await _ctx.SaveChangesAsync() > 0;
            }

            return false;
        }

        public async Task<bool> RemoveRefreshToken(RefreshToken refreshToken)
        {
            _ctx.RefreshTokens.Remove(refreshToken);
            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<RefreshToken> FindRefreshToken(string refreshTokenId)
        {
            var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

            return refreshToken;
        }

        public List<RefreshToken> GetAllRefreshTokens()
        {
            return _ctx.RefreshTokens.ToList();
        }

        public ClientUser FindClientUserByUserId(string userId)
        {
            var entity = _ctx.ClientUsers.FirstOrDefault(a => a.UserId == userId);
            return entity;
        }

        #endregion



        public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();

        }

    }

}