require.paths.unshift('.npm/.cache/express/1.0.0rc/package/lib')
require.paths.unshift('.npm/.cache/connect/0.2.3/package/lib')

app = require("express").createServer()

app.get "/", (req,res)-> res.send "Hello world"

app.listen parseInt(process.env.PORT) || 8000

puts "Up and running on #{process.env.PORT || 8000}..."