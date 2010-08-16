(function() {
  var REDIS_HOST, REDIS_PASS, REDIS_PORT, _a, app, incrementor, redis, sys;
  sys = require('sys');
  require.paths.unshift('vendor/.npm/.cache/express/1.0.0rc/package/lib');
  require.paths.unshift('vendor/.npm/.cache/connect/0.2.3/package/lib');
  app = require("express").createServer();
  _a = [process.env.REDIS_PASS, 'goosefish.redistogo.com', 9256];
  REDIS_PASS = _a[0];
  REDIS_HOST = _a[1];
  REDIS_PORT = _a[2];
  redis = require("./vendor/redis/redis-client").createClient(REDIS_PORT, REDIS_HOST);
  if (REDIS_PASS) {
    redis.auth(REDIS_PASS);
  }
  app.get("/", function(req, res) {
    return redis.get('test', function(err, val) {
      return res.send(("Running for " + (parseInt(val) * 5) + " seconds."));
    });
  });
  app.listen(parseInt(process.env.PORT) || 8000);
  sys.puts(("Up and running on " + (process.env.PORT || 8000) + "..."));
  incrementor = function() {
    return redis.incr('test');
  };
  setInterval(incrementor, 5000);
})();
