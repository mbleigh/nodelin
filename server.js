(function() {
  var REDIS_HOST, REDIS_PASS, REDIS_PORT, _a, app, incrementor, redis, sys;
  sys = require('sys');
  require.paths.unshift('vendor/.npm/.cache/express/1.0.0rc/package/lib');
  require.paths.unshift('vendor/.npm/.cache/connect/0.2.3/package/lib');
  app = require("express").createServer();
  if (process.env.REDISTOGO_URL) {
    _a = process.env.REDISTOGO_URL.match(/^.*:(.*)@(.*):([0-9]+)/i);
    REDIS_PASS = _a[0];
    REDIS_HOST = _a[1];
    REDIS_PORT = _a[2];
  }
  REDIS_PORT = REDIS_PORT || 6379;
  REDIS_HOST = REDIS_HOST || '127.0.0.1';
  redis = require("./vendor/redis/redis-client").createClient(REDIS_PORT, REDIS_HOST);
  if (REDIS_PASS) {
    redis.auth(REDIS_PASS);
  }
  app.get("/", function(req, res) {
    return redis.get('test', function(err, val) {
      return res.send(("Hello world " + (val)));
    });
  });
  app.listen(parseInt(process.env.PORT) || 8000);
  sys.puts(("Up and running on " + (process.env.PORT || 8000) + "..."));
  incrementor = function() {
    return redis.incr('test');
  };
  setInterval(incrementor, 5000);
})();
