(function() {
  var REDIS_HOST, REDIS_PASS, REDIS_PORT, Twitter, _a, _b, _c, _d, app, connect, ejs, express, lib, oauth, redis, sys, url;
  _b = ['oauth', 'ejs', 'connect', 'express'];
  for (_a = 0, _c = _b.length; _a < _c; _a++) {
    lib = _b[_a];
    require.paths.unshift(("vendor/.npm/" + (lib) + "/active/package/lib"));
  }
  sys = require('sys');
  oauth = require('oauth');
  url = require('url');
  redis = require('./vendor/redis').createClient(REDIS_PORT, REDIS_HOST);
  connect = require('connect');
  express = require('express');
  ejs = require('ejs');
  _d = [process.env.REDIS_PASS, 'goosefish.redistogo.com', 9256];
  REDIS_PASS = _d[0];
  REDIS_HOST = _d[1];
  REDIS_PORT = _d[2];
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
