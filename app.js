var express = require('express');
var httpProxy = require('http-proxy');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var proxy = httpProxy.createProxyServer();

app.use(express.static(__dirname + '/dist'));

app.use(compression());
app.use(cookieParser());

app.all('/api/*', function(req, res) {

    const API = 'http://localhost:8093';

    //代理
    proxy.web(req, res, {
        target: API,
        changeOrigin: true
    });
});
app.listen(9091);
