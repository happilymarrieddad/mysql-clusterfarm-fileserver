var express = require('express'),
        bodyParser = require('body-parser'),
        app = express(),
        fs = require('fs'),
        publicImagesUrl = '/var/www/fusion/public/images/temp/',
        exec = require('child_process').exec

function createFile(request,cb) {
        console.log('New file coming in for public consumption...',request.params.name)
        var cs = request.pipe(fs.createWriteStream(publicImagesUrl + request.params.name))
        cs.on('finish',function() {
                exec('chown ubuntu:ubuntu ' + publicImagesUrl + request.params.name,function(error,stout,stderr) {
                        if (error) {
                                cb(error)
                        } else {
                                console.log('Finished writing',request.params.name,'to',publicImagesUrl,'folder.')
                                cb(null)
                        }
                })
        })
}


app.use(bodyParser.json({limit: '512mb'}))
app.use(bodyParser.urlencoded({limit: '512mb', extended: true}))
app.use(bodyParser.json())

app.post('/public/images/:name',function(req,res) {
        createFile(req,function(err) {
	    res.status(200).send(null)
        })
})

app.all('*',function(req,res) { res.redirect('https://www.fusiontms.net') })

app.listen(8080,function() { console.log('file server running...') })
