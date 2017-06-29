var express = require('express')
var path = require('path')
var util = require('util')
var fs = require('fs')
var app = express()

app.engine('html', require('ejs').renderFile) 
app.set('views', __dirname)
app.get('/dist/*', function(req, res) {
    var filePath = req.path
    res.sendFile(path.join(__dirname, req.path))
})
app.get('/*', function(req, res) {
	res.render('index.html')
})

var server = app.listen(3000, function(){
    var port = server.address().port
    console.log('App listening at port:%s', port)
})