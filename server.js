(function() {
  var RedisCredentials, Twitter, app, connect, ejs, express, oauth, redis, sys, url, vrequire;
  vrequire = function(lib) {
    require.paths.unshift(("vendor/.npm/" + (lib) + "/active/package/lib"));
    return require(lib);
  };
  RedisCredentials = {
    host: process.env.REDIS_HOST,
    pass: process.env.REDIS_PASS,
    port: parseInt(process.env.REDIS_PORT)
  };
  sys = require('sys');
  oauth = vrequire('oauth');
  url = require('url');
  connect = vrequire('connect');
  express = vrequire('express');
  ejs = vrequire('ejs');
  redis = require('./vendor/redis').createClient(RedisCredentials.port, RedisCredentials.host);
  Twitter = new oauth.OAuth('http://api.twitter.com/oauth/request_token', 'http://api.twitter.com/oauth/access_token', process.env.TWITTER_KEY, process.env.TWITTER_SECRET, '1.0', null, 'HMAC-SHA1');
  if (RedisCredentials.pass) {
    redis.auth(RedisCredentials.pass);
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
