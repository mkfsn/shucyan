var express = require('express');
var app = express();

var path = __dirname;
var port = 7070;

function requestHandler(req, res) {
    res.sendFile(path + '/index.html');
}

function requestForbidden(req, res) {
    res.send(403);
}

app.use(express.static(path + '/dist'));

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
