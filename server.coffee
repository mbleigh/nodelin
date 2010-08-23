require.paths.unshift "vendor/.npm/#{lib}/active/package/lib" for lib in ['oauth', 'ejs', 'connect', 'express']

RedisCredentials =
  host: process.env.REDIS_HOST,
  pass: process.env.REDIS_PASS,
  port: parseInt(process.env.REDIS_PORT)
  
sys = require 'sys'
oauth = require 'oauth'
url = require 'url'
connect = require 'connect'
express = require 'express'
ejs = require 'ejs'
redis = require('./vendor/redis').createClient RedisCredentials.port, RedisCredentials.host

Twitter = new oauth.OAuth('http://api.twitter.com/oauth/request_token', 'http://api.twitter.com/oauth/access_token', process.env.TWITTER_KEY, process.env.TWITTER_SECRET, '1.0', null, 'HMAC-SHA1')
redis.auth(RedisCredentials.pass) if RedisCredentials.pass

app = express.createServer connect.cookieDecoder(), connect.session()
app.set 'view engine', 'ejs'

app.get "/", (req,res)-> 
  if req.session['access_token']
    sys.puts JSON.stringify req.session
    Twitter.getProtectedResource 'http://api.twitter.com/1/account/verify_credentials.json', 'GET', req.session['access_token'], req.session['access_secret'], (error, data, response)->
      res.render 'home',
        locals: 
          user: JSON.parse(data)
  else
    res.render 'login'

app.get '/login', (req,res)->
  Twitter.getOAuthRequestToken (error, token, secret, url, params)->
    req.session['token'] = token
    req.session['secret'] = secret
    sys.puts "Request Token: #{token}"
    sys.puts "Request Secret: #{secret}"
    res.redirect "http://api.twitter.com/oauth/authenticate?oauth_token=#{token}"
    
app.get '/callback', (req,res)->
  Twitter.getOAuthAccessToken req.session['token'], req.session['secret'], (error, access_token, access_secret, params)->
    sys.puts "Access Token: #{access_token}"
    sys.puts "Access Secret: #{access_secret}"
    sys.puts "Params: #{JSON.stringify params}"
    req.session['access_token'] = access_token
    req.session['access_secret'] = access_secret
    res.redirect '/'
  
  # req.authenticate ['twitter'], (error, authenticated)->
  #     res.send "Hello World: #{JSON.stringify(req.session.auth.user)}"
    
  # redis.get 'test', (err, val)->
  #     res.send "Running for #{parseInt(val) * 5} seconds."

app.listen parseInt(process.env.PORT) || 3000

sys.puts "Up and running on #{process.env.PORT || 3000}..."