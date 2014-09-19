/**
 * Created by old-fish on 2014/8/21.
 * Add methods by old-fish on 2014/8/22
 * 1.create
 * 2.load
 * 3.isExistLocalJSONConfig
 */

var fs = require('fs');
var xml2js = require('xml2js');
var _ = require('underscore');
var notify = require('../utils/httpnotify');

var content = {};
const encoderSourcePath = './config/Cameras.xml';
const configPath = './config/config.json';

var writeLocalJSONConfig  = function(data,callback){
    fs.writeFile(configPath,data,null,callback);
};

var mtsBuilder = function (data,callback) {
    var mts = content || {};
    mts.ip = data.ip;
    mts.port = data.port;
    mts.name = data.name;
    mts.encoders = data.encoders || [];
    if(callback) callback();
};

var encoderBuilder = function(id,content,callback){
    var encoder = {};
    encoder.id = id;
    encoder.name = content.name;
    encoder.url = content.link.url;

    if(callback) callback(encoder);
};

var signalSourceBuilder = function(source,encoder){
    var result = {};
    result.id = source[0].id;
    result.name = source[0].name;
    result.url = source[0].url;

    if(encoder.STATE == 'STATE_IDLE') {
        result.state = 'off';
    } else if(encoder.STATE == 'STATE_RECORDING'){
        result.state = 'on';
    } else {
        result.state = 'unknown';
    }

    if(encoder.SECONDS == undefined){
        result.seconds = 0;
    }else{
        result.seconds = encoder.SECONDS;
    }

    if(encoder.COUNT == undefined){
        result.count = 0;
    }else{
        result.count = encoder.COUNT;
    }

    if(encoder.FILE == undefined){
        result.file = "";
    }else{
        result.file = encoder.FILE;
    }

    return result;
};

var mts = {
    isExistLocalJSONConfig : function(){
        return fs.existsSync(configPath);
    },

    getIp : function(){
        return content.ip;
    },

    getPort : function () {
        return content.port;
    },

    getEncoders : function () {
        return content.encoders;
    },

    getEncodersByIp : function(ip){
       return content.encoders.filter(function(item){
            return item.url.indexOf(ip) > 0 && item.url.indexOf('id=0') > 0;
        });
    },

    getEncodersById : function(id){
        return content.encoders.filter(function(item){
            return item.id==id;
        });
    },

    getEncoderByName: function(encoder,callback){
        if(callback) callback(_.find(content.encoders,function(item){
            return item.name == encoder;
        }));
    },

    create : function(ip,port,name,callback){
        content.ip = ip;
        content.port = port;
        content.name = name || '别名';
        content.encoders = [];
        var parser = new xml2js.Parser();

        fs.exists(encoderSourcePath,function(exists){
            if(!exists){
                console.log('GTRecordService无法读取MTS的Cameras配置文件');
                return null;
            }

            fs.readFile(encoderSourcePath,function(err,data){
                parser.parseString(data);
            });
        });

        parser.addListener('end',function(result){
            result.Cameras.camera.forEach(function(item,index){
                content.encoders.push(item.$);
            });

            var data = JSON.stringify(content);

            if(mts.isExistLocalJSONConfig()){
                fs.unlinkSync(configPath);
            }

            writeLocalJSONConfig(data);

            parser.removeAllListeners('end');
            parser = null;

            if(callback) callback();
         });
    },

    load : function(){
        if(mts.isExistLocalJSONConfig()){
            var buf = fs.readFileSync(configPath,'utf8');
            var data = JSON.parse(buf);
            mtsBuilder(data);
        }else{
            return null;
        }
    },

    start: function(encoderId,filename,res){
        var req = {ip: this.getIp(),port: this.getPort(), path:"/start/" + encoderId + "/" + filename};
        var second = 1000;
        setTimeout(function(){
           notify.post(req,res);
        },second);
     },

    stop: function(encoderId,res,callback){
        var req = {ip: this.getIp(),port: this.getPort(), path:"/stop/" + encoderId};
        notify.post(req,res,function(statusCode){
            if(callback) callback(statusCode);
        });

    },

    removeEncoderByURL: function (url,callback) {
        var encoders = content.encoders.filter(function(item){
          return item.url == url;
        });
        var ids = [];
        encoders.forEach(function(item){
           ids.push(item.id);
           content.encoders.splice(content.encoders.indexOf(item));
         /*  delete content.encoders[content.encoders.indexOf(item)];*/
        });

        if(callback) callback(ids);
    },

    addLinkEncoder: function(content,callback){
        var req = {ip: this.getIp(),port: this.getPort(), path:"/add",content:content.link};
        notify.postByJson(req,function(res,id){
            if(res.statusCode == 200){
               encoderBuilder(id,content,function(encoder){
                   var encoders = mts.getEncoders();
                   if(_.indexOf(encoders,encoder) < 1){
                        encoders.push(encoder);
                   }
                   if(callback) callback(res.statusCode,encoder);
               });
            }else{
                if(callback) callback(res.statusCode);
            }
        });
    },

    removeLinkEncoder: function(id,callback){
        var req = {ip: this.getIp(),port: this.getPort(), path:"/remove/" + id};

        notify.post(req,function(res){
            if(callback) callback(res.statusCode);
        });
    },

    query: function(callback){
        var req = {ip: this.getIp(),port: this.getPort(), path:"/query"};
        notify.get(req,function(res){
           var result = [];

           JSON.parse(res).forEach(function(item){
               var source = mts.getEncodersById(item.ID);
               if(source.length > 0){
                   result.push(signalSourceBuilder(source, item));
               }
           });

           if(callback) callback(result);
        });
    }
};

experts = module.exports = mts;
