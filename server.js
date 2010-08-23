(function() {
  var REDIS_HOST, REDIS_PASS, REDIS_PORT, RedisStore, Twitter, _a, app, auth, connect, express, oauth, redis, sys, url;
  sys = require('sys');
  require.paths.unshift('vendor/.npm/.cache/express/1.0.0rc/package/lib');
  require.paths.unshift('vendor/.npm/.cache/connect/0.2.3/package/lib');
  require.paths.unshift('vendor/.npm/.cache/oauth/0.8.0/package/lib');
  require.paths.unshift('vendor/.npm/.cache/connect-auth/0.1.2/package/lib');
  require.paths.unshift('vendor/.npm/.cache/connect-redis/0.0.2/package/lib');
  require.paths.unshift('vendor/.npm/ejs/0.2.0/package/lib');
  auth = require('connect-auth');
  oauth = require('oauth');
  url = require('url');
  RedisStore = require('connect-redis');
  redis = require("./vendor/redis/redis-client").createClient(REDIS_PORT, REDIS_HOST);
  connect = require('connect');
  express = require('express');
  _a = [process.env.REDIS_PASS, 'goosefish.redistogo.com', 9256];
  REDIS_PASS = _a[0];
  REDIS_HOST = _a[1];
  REDIS_PORT = _a[2];
  Twitter = new oauth.OAuth('http://api.twitter.com/oauth/request_token', 'http://api.twitter.com/oauth/access_token', process.env.TWITTER_KEY, process.env.TWITTER_SECRET, '1.0', null, 'HMAC-SHA1');
  if (REDIS_PASS) {
    redis.auth(REDIS_PASS);
  }
  app = express.createServer(connect.cookieDecoder(), connect.session());
  app.set('view engine', 'ejs');
  app.get("/", function(req, res) {
    if (req.session['access_token']) {
      sys.puts(JSON.stringify(req.session));
      return Twitter.getProtectedResource('http://api.twitter.com/1/account/verify_credentials.json', 'GET', req.session['access_token'], req.session['access_secret'], function(error, data, response) {
        return res.render('home', {
          locals: {
            user: JSON.parse(data)
          }
        });
      });
    } else {
      return res.render('login');
    }
  });
  app.get('/login', function(req, res) {
    return Twitter.getOAuthRequestToken(function(error, token, secret, url, params) {
      req.session['token'] = token;
      req.session['secret'] = secret;
      sys.puts(("Request Token: " + (token)));
      sys.puts(("Request Secret: " + (secret)));
      return res.redirect(("http://api.twitter.com/oauth/authenticate?oauth_token=" + (token)));
    });
  });
  app.get('/callback', function(req, res) {
    return Twitter.getOAuthAccessToken(req.session['token'], req.session['secret'], function(error, access_token, access_secret, params) {
      sys.puts(("Access Token: " + (access_token)));
      sys.puts(("Access Secret: " + (access_secret)));
      sys.puts(("Params: " + (JSON.stringify(params))));
      req.session['access_token'] = access_token;
      req.session['access_secret'] = access_secret;
      return res.redirect('/');
    });
  });
  app.listen(parseInt(process.env.PORT) || 3000);
  sys.puts(("Up and running on " + (process.env.PORT || 3000) + "..."));
})();
