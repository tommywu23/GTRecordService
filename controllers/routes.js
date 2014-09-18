/**
 * Created by tommy_2 on 2014/8/20.
 */
var express = require('express');
var mts = require('../models/mts');
var router = express.Router();
var notify = require('../utils/httpnotify');

mts.load();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/recording',function(req,res){
   mts.query(function(content){
       console.log('获取当前MTS录播状态');
       res.statusCode = 200;
       res.setHeader("Content-Type", "application/json");
       res.send(content);
   });
});

router.post('/recording',function(req,res){
    if(req.headers['content-type'].indexOf('application/json') < 1) {
        res.send('the content-type does not accept.', 400);
    }
    req.body.forEach(function(item){
        data = item.address.replace('rtsp://','').split('/');
        //获取本地内容服务器地址
        local = data[0].split(':')[0].replace('.11','.10');
        if(local == mts.getIp()){
            if(data.length == 2){
                encoderIp = data[1].match(/\d+.*/g).toString();
                encoders = mts.getEncodersByIp(encoderIp);
                encoders.forEach(function(encoder){
                    encoder.name = item.name;
                    mts.start(encoder.id,encoder.name + "_" + encoder.id,res);
                });
            }else if(data.length > 2){
                var address = item.address.toString().replace(mts.getIp() + ':8554/','');
                obj = {
                    link:JSON.parse("{\"url\":\""+address+"\",\"channel\":0,\"group_id\":1}"),
                    name:item.name
                };

                mts.getEncoderByName(obj.name,function(encoder){
                    if(encoder == undefined){
                        mts.addLinkEncoder(obj,function(statusCode,encoder){
                            mts.start(encoder.id,encoder.name + "_" + encoder.id,res);
                        });
                    }else{
                        mts.start(encoder.id,encoder.name + "_" + encoder.id,res);
                    }
                });
            }

        }
    });
    res.send('OK');
});

router.delete('/recording',function(req,res){
    if(req.headers['content-type'].indexOf('application/json') < 1) {
        res.send('the content-type does not accept.', 400);
    }
    req.body.forEach(function(item){
        data = item.address.replace('rtsp://','').split('/');
        //获取本地内容服务器地址
        local = data[0].split(':')[0].replace('.11','.10');
        if(local == mts.getIp()){
            if(data.length == 2){
                encoderIp = data[1].match(/\d+.*/g).toString();
                encoders = mts.getEncodersByIp(encoderIp);
                encoders.forEach(function(encoder){
                    mts.stop(encoder.id,res);
                });
            }else if(data.length > 2){
                var address = item.address.toString().replace(mts.getIp() + ':8554/','');
                obj = {
                    link:JSON.parse("{\"url\":\""+address+"\",\"channel\":0,\"group_id\":1}"),
                    name:item.name
                };

               mts.removeEncoderByURL(obj.link.url,function(ids){
                   if(ids.count == undefined) res.send('200');
                   ids.forEach(function(id){
                       mts.stop(id,res,function(statusCode){
                          mts.removeLinkEncoder(id,function(statusCode){
                             res.send(statusCode.toString());
                          });
                       });
                   });
               });
            }
        }
    });
    res.send('OK');
});

module.exports = router;