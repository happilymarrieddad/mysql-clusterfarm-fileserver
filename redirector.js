var express = require('express');
var app = express();

app.all('*',function (req, res) {
    res.redirect('https://www.fusiontms.net' + req.url);
});

app.listen(80);
