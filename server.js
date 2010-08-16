(function() {
  var REDIS_HOST, REDIS_PASS, REDIS_PORT, _a, app, sys;
  sys = require('sys');
  require.paths.unshift('vendor/.npm/.cache/express/1.0.0rc/package/lib');
  require.paths.unshift('vendor/.npm/.cache/connect/0.2.3/package/lib');
  app = require("express").createServer();
  _a = app.get("/", function(req, res) {
    return res.send(("Hello world " + (process.env.REDISTOGO_URL)));
  });
  REDIS_PASS = _a[0];
  REDIS_HOST = _a[1];
  REDIS_PORT = _a[2];
  app.listen(parseInt(process.env.PORT) || 8000);
  sys.puts(("Up and running on " + (process.env.PORT || 8000) + "..."));
})();
