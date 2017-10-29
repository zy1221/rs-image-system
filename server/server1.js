const http = require('http'); 
const mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var $=require('jquery');
var app = express();

var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'zy920908',
    database:'rsimage'
})
connection.connect();

app.get('/',function(req,res){
    connection.query('select * from image',function(error,results,field){
        if(error)throw error;
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.send(JSON.stringify(results));
    });    
})


app.get('/queryGeocoord/',function(req,res){
    var place=req.query.place;
    var category=req.query.category;
    var imagename=req.query.imagename;
    var sql='select LON, LAT from image where PLACE_NAME=\''+place+'\'and CATEGORY=\''+category+'\'and IMAGE_NAME=\''+imagename+'\'';
    connection.query(sql,function(error,results,field){
        if(error)throw error;
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.send(JSON.stringify(results));
    });     
})
app.use('/static',express.static(__dirname + '/public/upload'));

app.get('/deleteImage/',function(req,res){
    var place=req.query.place;
    var category=req.query.category;
    var imagename=req.query.imagename;
    var filename=imagename+'.png';
    var placePath="./public/upload/"+place+'/';
    var path="./public/upload/"+place+'/'+category+'/';
    deleteFolderRecursive(path,filename);
    var files=[];
    files=fs.readdirSync(path);
    if(files.length===0){
        fs.rmdirSync(path);  
        fs.rmdirSync(placePath);
    }
    var sql='delete from image where PLACE_NAME=\''+place+'\'and CATEGORY=\''+category+'\'and IMAGE_NAME=\''+imagename+'\'';
    connection.query(sql,function(error,results,field){
        if(error)throw error;
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.send(JSON.stringify('OK'));
    });     
})


//上传图片
app.post('/upload',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    var form = new multiparty.Form({
        uploadDir: './public/upload/',
        encoding: 'utf-8'
    });
    form.parse(req,function(err, fields, files) {
        var imgs = files.image;
        var place=fields.place[0];
        var category=fields.category[0];
        //var imagename=fields.imagename[0];
        var lon=Number(fields.lon[0]);
        var lat=Number(fields.lat[0]);
        //地名和类型路径
        var placePath=`./public/upload/${fields.place}`;
        var categoryPath=`./public/upload/${fields.place}/${fields.category}`;

        //遍历图片
        //存放重复图片名字
        var photos=[]
        imgs.forEach(function(item,i){
            var sql='insert into image (IMAGE_NAME,PLACE_NAME,CATEGORY,LON,LAT) values(\''
                +item.originalFilename+'\',\''+place+'\',\''+category+'\',\''+lon+'\',\''+lat+'\''+')';
            //图片路径   
            
            var photoPath = `./public/upload/${fields.place}/${fields.category}/${item.originalFilename}`;
            if(fs.existsSync(photoPath)){
                photos.push(item.originalFilename);
                fs.unlinkSync(item.path)//删除已存在的图片
            }
            else{
                if(!fs.existsSync(categoryPath)){
                    if(fs.existsSync(placePath)){
                        fs.mkdirSync(categoryPath)
                    }else{
                        fs.mkdirSync(placePath);
                        fs.mkdirSync(categoryPath);
                    }
                    fs.rename(item.path, photoPath);               
                    connection.query(sql,function(error,results,field){
                        if(error)throw error;
                    }); 
                }
                else{
                    fs.rename(item.path, photoPath);
                    connection.query(sql,function(error,results,field){
                        if(error)throw error;
                    });   
                }
            }
        })
        res.send(JSON.stringify(photos));
    });
})

var server=app.listen(3000,function(){
    var host=server.address().address;
    var port= server.address().port;
    console.log('Example app listening at http://%s:%s',host,port);
})

function deleteFolderRecursive(url,filename) {
  var files = [];
  //判断给定的路径是否存在
  if( fs.existsSync(url) ) {
    files = fs.readdirSync(url);
    files.forEach(function(file,index){
      var curPath = path.join(url,file);
        if(file==filename){
            fs.unlinkSync(curPath)
        }
    });
  }
};
