/* Import modules */
const http = require('http');
const url = require('url');
const fs = require('fs');

/* Config */
const port = 80;

/* main */
const app = require('http').createServer();
app.on('request', onRequest);
app.listen(port);

function onRequest(req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    if (pathname == '/') {
        sendFile(res, 'index.html'); 
    } else {
        sendFile(res, pathname.substring(1)); 
    }
}

function sendFile(res, filepath){
    fs.readFile(filepath, function(err, data) {  
        if (err) {  
            res.writeHead(500);  
            res.end('Error reading default index.');  
        } else {  
            res.writeHead(200);  
            res.end(data); 
        }  
    }); 
}
