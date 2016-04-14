var express = require('express'),
   app = express(),
   http = require('http').Server(app),
   io = require('socket.io')(http);

var contestManager = require('./modules/ContestManager')(30000); // two contests per minute

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Headers", "Content-Type");
   res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
   res.header("Access-Control-Allow-Credentials", "true");
   next();
});

app.get('/', function(req, res) {
   res.send("Game server");
});

contestManager.start(io);

http.listen(9000);