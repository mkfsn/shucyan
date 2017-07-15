var express = require('express');
var httpProxy = require('http-proxy');

var app = express();

var path = __dirname;
var port = 7070;

var proxy = httpProxy.createProxyServer();

function requestHandler(req, res) {
    res.sendFile(path + '/index.html');
}

function requestForbidden(req, res) {
    res.send(403);
}

function apiProxy(host, port) {
    return function(req, res, next) {
        if (req.url.match(new RegExp('^\/api\/'))) {
            proxy.proxyRequest(req, res, {target: "http://" + host + ":" + port});
        } else {
            next();
        }
    }
}

app.use('/dist', express.static(path + '/dist'));

if (process.env.CHANNEL_HOST && process.env.CHANNEL_PORT) {
    console.log("Proxy /api/ to http://" + process.env.CHANNEL_HOST + ":" + process.env.CHANNEL_PORT)
    app.use(apiProxy(process.env.CHANNEL_HOST, parseInt(process.env.CHANNEL_PORT)));
}

app.get('/', requestHandler);
app.get('/home', requestHandler);
app.get('/login', requestHandler);
app.get('/register', requestHandler);
app.get('/about', requestHandler);
app.get('/latest', requestHandler);
app.get('/channel/*', requestHandler);

app.get('/src/*', requestForbidden);
app.get('/node_modules/*', requestForbidden);

app.listen(port);
