var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    fs = require('fs'),
    failed_response = {
		success:0,
		message:'Failed to read file..'
	},
	exec = require('child_process').exec;

function createFile(name,request,path,owner) {
	console.log('New file coming in...');
	var cs = request.pipe(fs.createWriteStream(path+name))
	cs.on('finish',function() {
		exec('chown '+owner+':'+owner+' ' + path+name + ' && chmod 777 ' + path+name,function(error,stout,stderr) {
			if (error) {console.log(error)}
			console.log('Finished writing',name,'to',path,'folder.')
		})
	})
}


app.use(bodyParser.json({limit: '512mb'}));
app.use(bodyParser.urlencoded({limit: '512mb', extended: true}));
app.use(bodyParser.json());

app.get('/files/:name',function(req,res) {
    res.sendFile(baseUrl+req.params.name);
})

app.post('/files/:name',function(req,res) {
    createFile(req.params.name,req,'/var/www/files/','ubuntu');
})

app.post('/mysql/:name',function(req,res) {
    createFile(req.params.name,req,'/tmp/','mysql')
})

app.all('*',function(req,res) { res.redirect('https://www.fusiontms.net') })

app.listen(8080,function() { console.log('file server running...') })
