var http=require('http');
var setting={};
require('./setting').host(setting);
exports.pcapInfo=function(host,port,message,info,over){
    var opt = {
        host:host,
        port:port,
        method:'POST',
        headers:{
            "Content-Length":message.length
        }
    };
    var key=message.split('&')[1].split('=')[1];
    var attr=key.split('-')[1];
    var body = '';
    var req = http.request(opt, function(res) {
        console.log("Got response: " + res.statusCode);
        res.on('data',function(d){
            body += d;
            }).on('end', function(){
                info[attr]=JSON.parse(body)[key];
                console.log(message);
                console.log('end');
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
    req.write(message);
}
exports.sendMessage2=function(host,port,message,info){
    var opt = {
        host:host,
        port:port,
        method:'POST',
        headers:{
            "Content-Length":message.length
        }
    };
    var body = '';
    var req = http.request(opt, function(res) {
        console.log("Got response: " + res.statusCode);
        res.on('data',function(d){
            body += d;
            }).on('end', function(){
                info.data=JSON.parse(body);
                info.over=true;
                console.log(message);
                console.log('end');
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
    req.write(message);
}