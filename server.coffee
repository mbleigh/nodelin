sys = require 'sys'
require.paths.unshift('vendor/.npm/.cache/express/1.0.0rc/package/lib')
require.paths.unshift('vendor/.npm/.cache/connect/0.2.3/package/lib')

app = require("express").createServer()

# Get Redis up and running.
[REDIS_PASS, REDIS_HOST, REDIS_PORT] = [process.env.REDIS_PASS, 'goosefish.redistogo.com', 9256]
 
redis = require("./vendor/redis/redis-client").createClient(REDIS_PORT, REDIS_HOST)
redis.auth(REDIS_PASS) if REDIS_PASS

app.get "/", (req,res)-> 
  redis.get 'test', (err, val)->
    res.send "Running for #{parseInt(val) * 5} seconds."

app.listen parseInt(process.env.PORT) || 8000

sys.puts "Up and running on #{process.env.PORT || 8000}..."

incrementor = ->
  redis.incr('test')
  
setInterval incrementor, 5000