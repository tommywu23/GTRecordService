/**
 * Created by tommy_2 on 2014/8/20.
 */
var http = require('http');

var httpNotify = {
    get: function(req, callback){
        //var url = "http://" + req.ip + ":" + req.port + req.path;
        var options = {
            host : req.ip,
            port : req.port,
            path : req.path,
            method : 'GET',
            headers: {
                "Accept-Contect": "application/json"
            }
        };
        http.get(options,function(res){
            var body = "";
            res.on('data', function(chunk) {
                body += chunk;
            });

            res.on('end',function(){
               callback(body);
            });
        }).on('error',function(err){
            console.log('problem with request: ' + err.message);
        });
    },

    post:function(req,res,callback){
        var client = res;
        var options = {
            host : req.ip,
            port : req.port,
            path : req.path,
            method : 'POST'
        };

        var req = http.request(options, function(res){
            console.log('STATUS:' + res.statusCode);

            res.setEncoding('utf8');
            var data = {};
            res.on('data',function(chunk){
                data = chunk;
            });

            res.on('end',function(){
                if(callback) callback(res.statusCode,data);
            });
        });

        req.on('error',function(err){
            console.log('problem with request: ' + err.message);
            client.send(res.statusCode);
        });

        req.write('data\n');
        req.write('data\n');
        req.end();
    },
    postByJson:function(req,callback){
        var content = JSON.stringify(req.content);
        var options = {
            host : req.ip,
            port : req.port,
            path : req.path,
            method : 'POST',
            headers: {
                "Accept-Contect": "application/json",
                "Content-Type": "application/json",
                "Content-Length": content.length
            }
        };

        var req = http.request(options, function(res){
            res.setEncoding('utf8');
            var data = {};
            res.on('data',function(chunk){
                data = chunk;
            });
            res.on('end',function(){
                if(callback) callback(res,data);
            });
        });

        req.on('error',function(err){
            console.log('problem with request: ' + err.message);
        });

        req.write(content);
        req.end();
    }
};

experts = module.exports = httpNotify;



