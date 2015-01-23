var express = require('express');
var app = express();
var redis = require("redis");

// var config = require('./config.json')[app.get('env')];
// app.use(express.errorHandler(config.errorHandlerOptions));
// var r = require("redis").createClient(config.redisPort,config.redisHost);

// development
if (app.get('env') === "production") {
// production
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

} else {
	var client = redis.createClient();
};




// redis basic works
client.on("error", function(err) {
    console.log("Error " + err);
});

app.use(express.static(__dirname + '/public'));

// load basic template
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
})

// test set redis
app.get('/set/:hashkey/:key/:value', function(req, res) {
    client.hset(req.params["hashkey"], req.params["key"], req.params["value"], redis.print);
    res.send("Submitted:");
})

// test get 
app.get('/get/:hashkey', function(req, res) {
    client.hgetall(req.params["hashkey"], function(err, obj) {
        console.log(obj);
        res.send(obj);
    })
})

// run server
var server = app.listen(process.env.PORT || 3000, function() {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)

})