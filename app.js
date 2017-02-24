/**
 * Created by wangxiaodong on 2017/2/13.
 * 应用程序的启动（入口）文件
 */

const express = require('express');
const swig = require('swig');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cookies = require('cookies');
const app = express();

const User = require('./models/User');

app.use(bodyParser.urlencoded({extended:true}));

//设置cookie
app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);

    //解析登录用户的cookie信息
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            //获取当前登录用户的类型，是否为管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })

        }catch(e){
            next();
        }
    }else{
        next();
    }

});

//设置静态文件的托管
app.use('/public', express.static(__dirname + '/public'));
//配置模板引擎
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');

//在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});

//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:27017/blog3',function(err){
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.listen(8081);
    }
});
