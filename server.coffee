sys = require 'sys'
require.paths.unshift('vendor/.npm/.cache/express/1.0.0rc/package/lib')
require.paths.unshift('vendor/.npm/.cache/connect/0.2.3/package/lib')

app = require("express").createServer()

# Get Redis up and running.
[REDIS_PASS, REDIS_HOST, REDIS_PORT] = process.env.REDISTOGO_URL.match /^.*:(.*)@(.*):([0-9]+)/i if process.env.REDISTOGO_URL
REDIS_PORT ||= 6379
REDIS_HOST ||= '127.0.0.1'
 
redis = require("./vendor/redis/redis-client").createClient(REDIS_PORT, REDIS_HOST)
redis.auth(REDIS_PASS) if REDIS_PASS

app.get "/", (req,res)-> 
  redis.get 'test', (err, val)->
    res.send "Hello world #{val}"

app.listen parseInt(process.env.PORT) || 8000

sys.puts "Up and running on #{process.env.PORT || 8000}..."

incrementor = ->
  redis.incr('test')
  
setInterval incrementor, 5000