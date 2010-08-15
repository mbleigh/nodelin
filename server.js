(function() {
  var app, sys;
  sys = require('sys');
  require.paths.unshift('vendor/.npm/.cache/express/1.0.0rc/package/lib');
  require.paths.unshift('vendor/.npm/.cache/connect/0.2.3/package/lib');
  app = require("express").createServer();
  app.get("/", function(req, res) {
    return res.send("Hello world");
  });
  app.listen(parseInt(process.env.PORT) || 8000);
  sys.puts(("Up and running on " + (process.env.PORT || 8000) + "..."));
})();
