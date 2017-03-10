var index=require('../controller/indexcontroller.js');
var User=require("../models/user");
var fs=require('fs');
var SSH=require('simple-ssh');
var connection=require('../connection');
var setting={};
require('../setting').host(setting);
module.exports=function(app){
	//预判断会话中是否存在user
	app.use(function(req,res,next){
		var _user=req.session.user;
		app.locals.user=_user;
		next();
	});
	app.get('/',function(req,res){
		res.render('home',{
			hosts:setting.host
		});
	});
	app.get('/speed',function(req,res){
		res.render('speed');
	});
	//注册web用户，并创建ca用户和系统用户
	app.post('/user/signup',function(req,res){
		var _user=req.body.user;
		var _name=_user.name;
		if(!_name){
			res.render('signup',{
				messages:"用户名不能为空，请重新注册"  //传递变量，提示出错的信息
			});
		}else{
		User.find({name:_name},function(err,user){//user即是数据库中找到的项
			if(err){
				console.log(err);
			}
			if(user.length!=0){
				res.render('signin',{
					messages:"用户已存在，请登录"
				});
			}else{
				var user=new User(_user);//在数据库中没找到，将数据封装成User对象，进行存储
				user.save(function(err){
					if(err){
						console.log(err);
					}else{
						console.log('注册成功');
						res.redirect('/');
						// var cmd="useradd "+_user.name+" && echo '"+_user.name+":"+_user.password+"' | chpasswd"; //创建系统用户
						// 创建ca用户
						// var cmd2="./createca.sh "+_user.name;
						// var cmd4="grid-mapfile-add-entry -dn '/O=Grid/OU=GlobusTest/OU=simpleCA-gf02.863/OU=Globus Simple CA/CN=gridftp-"+_user.name+"' -ln "+_user.name;

						// var ssh2=new SSH({
						// 	//ca服务器
						// 	host:setting.ca.host,
						// 	user:setting.ca.user,
						// 	pass:setting.ca.pass
						// });
						// var str2='<h2>'+setting.ca+'</h2><br>';
						// ssh2.exec(cmd,{
						// 	out:function(stdout){
						// 		str2+='<span>'+stdout+'</span>'+'<br>';
						// 		console.log(stdout);
						// 	},
						// 	err:function(stderr){
						// 		str2+='<span>'+stderr+'</span>'+'<br>';
						// 		console.log(stderr);
						// 	}
						// })
						// .exec(cmd2,{
						// 	out:function(stdout){
						// 		str2+='<span>'+stdout+'</span>'+'<br>';
						// 		console.log(stdout);
						// 	},
						// 	err:function(stderr){
						// 		str2+='<span>'+stderr+'</span>'+'<br>';
						// 		console.log(stderr);
						// 	}
						// })
						// .exec(cmd4,{
						// 	out:function(stdout){
						// 		str2+='<span>'+stdout+'</span>'+'<br>';
						// 		console.log(stdout);
						// 	},
						// 	err:function(stderr){
						// 		str2+='<span>'+stderr+'</span>'+'<br>';
						// 		console.log(stderr);
						// 	},
						// 	exit:function(){
						// 		var str4='<h2>'+setting.host1+'</h2><br>';
						// 		var ssh4=new SSH({
						// 			host:setting.host1,
						// 			user:"root",
						// 			pass:"gridftp04"
						// 		});
						// 		ssh4
						// 		.exec(cmd,{
						// 		out:function(stdout){
						// 			str4+='<span>'+stdout+'</span>'+'<br>';
						// 			console.log(stdout);
						// 		},
						// 		err:function(stderr){
						// 			str4+='<span>'+stderr+'</span>'+'<br>';
						// 			console.log(stderr);
						// 		}	
						// 	})
						// 	.exec(cmd4,{
						// 		out:function(stdout){
						// 			str4+='<span>'+stdout+'</span>'+'<br>';
						// 			console.log(stdout);
						// 		},
						// 		err:function(stderr){
						// 			str4+='<span>'+stderr+'</span>'+'<br>';
						// 			console.log(stderr);
						// 		},
						// 		exit:function(){
						// 			res.send('<p>'+str2+'</p><p>'+str4+'</p>');
						// 		}
						// 	})
						// 	.start();
						// 		}
						// })
						// .start();
					}
				});
			}
		});
	}
	});
	//user list page
	app.get('/userlist',function(req,res){
		User.find({},function(err,users){
			if(err){
				console.log(err);
			}
			if(users){
				res.render('userlist',{
					users:users           //将数据库中搜到的users传给前端页面中的users变量，为一个数组
				});
			}
		})
	});
	app.delete('/user/list',function(req,res){
		var _name=req.query.name;      
		if(_name){
			User.remove({name:_name},function(err,users){ //要确认_name的值是否存在
				if(err){
					res.send({success:0});
				}else{
					res.send({success:1});
				}
			})
		}
	});
	app.post('/user/signin',function(req,res){
		var _user=req.body.user;
		var _name=_user.name;
		var _password=_user.password;
		User.findOne({name:_name},function(err,user){
			if(err){
				console.log(err);
			}
			if(user){
				if(_password==user.password){
					req.session.user=user;
					res.redirect('/');
				}else{
					res.render('signin',{
						messages:"密码不正确，请重新登录"
					});
				}
			}else{
				res.render('signup',{
					messages:"用户名不存在，请先注册"
				});
			}
		})
	});
	app.get('/showsignin',function(req,res){
		res.render('signin',{messages:0});
	});
	app.get('/showsignup',function(req,res){
		res.render('signup',{messages:0});
	})
	app.get('/user/signout',function(req,res){
		delete req.session.user;
		delete app.locals.user;
		res.redirect('/');
	});
	app.get('/transfer',function(req,res){
		res.render('transfer',{
			hosts:setting.host
		});
	});
	// app.get('/local',function(req,res){
	// 	res.render('local');
	// });
	app.post('/transfer',function(req,res){
		var _file=req.body;
		var _host;
		if(_file.source==setting.ca.ip){
			_host=_file.destination;
		}else{
			_host=_file.source;
		}
		var cmd="echo 123456 | myproxy-logon -s gf02.863 -S";
		//gf02.863这种形式改为ip
		var cmd2="time globus-url-copy gsiftp://"+getHost(_file.source).netName+_file.fileSource+" gsiftp://"+getHost(_file.destination).netName+_file.filedes;
		var ssh=new SSH({
			// host:_file.destination,
			// user:req.session.user.name,
			// pass:req.session.user.password
			host:_host,//不能是172
			user:getHost(_host).user,
			pass:getHost(_host).password
		});
		var message='';
		ssh.exec(cmd,{
			out:function(stdout){
				message+=stdout+'<br>';
				console.log(stdout);
			},
			err:function(stderr){
				message+=stderr+'<br>';
				console.log(stderr);
			}
		})
		.exec(cmd2,{
			out:function(stdout){
				message+=stdout+'<br>';
				console.log(stdout);
			},
			err:function(stderr){
				message+=stderr+'<br>';
				console.log(stderr);
			},
			exit:function(){
				res.json(message);
			}
		}).start();
	});
	app.post('/transferLocal',function(req,res){
		var _file=req.body;
		console.log(_file);
		res.json(_file);
	});
	app.post('/search',function(req,res){
		var _file=req.body.filename;
		var _host=req.body.hostname;
		var ssh1=new SSH({
			host:_host,
			// user:req.session.user.name,
			// pass:req.session.user.password
			user:getHost(_host).user,
			pass:getHost(_host).password
		});
		var cmd="cd / && find -name "+_file;
		var str="";
		ssh1.exec(cmd,{
			out:function(stdout){
				console.log(_host+':\n'+stdout);
				str+=stdout;
			},
			err:function(stderr){
				console.log(stderr);
			},
			exit:function(){
				res.send(_host+':\n'+str);
			}	
		}).start();
	});
	app.post('/test',function(req,res){
		var _file=req.body;
		res.json(_file.source);
	});
	function getHost(host){
		for(var i=0;i<setting.host.length;i++){
			if(setting.host[i].ip==host){
				return {
					ip:host,
					user:setting.host[i].user,
					password:setting.host[i].pass,
					netName:setting.host[i].netName
				};
			}
		}
	}


	var capturedata={};
	var timer=null;
	app.get('/captureData',function(req,res){
		res.json(capturedata);
	});
	function callback1(res){
		var obj1={
			preByte:[0,0,0,0,0],
			preTime:[0,0,0,0,0]
		};
		timer=setInterval(function(){
			//判断是否抓包中
			var flag={};
			var over={
				host:false
			}
			connection.pcapInfo('10.10.88.172','1234','type=info&key=nic-traffic',obj1,over);
			var timer1=setTimeout(function(){
					for(var i=0;i<obj1.traffic.length;i++){
						if(!(obj1.traffic[i].name in capturedata)){
							capturedata[obj1.traffic[i].name]=[];
						}
						var speed=parseInt((obj1.traffic[i]['total-bytes']-obj1.preByte[i])*8/(1000000*(obj1.traffic[i].time-obj1.preTime[i])));
						capturedata[obj1.traffic[i].name].push([parseInt(obj1.traffic[i].time*1000),speed]);
						obj1.preByte[i]=obj1.traffic[i]['total-bytes'];
						obj1.preTime[i]=obj1.traffic[i].time;
						if(obj1.traffic[i].name=='p5p2'){
							fs.appendFile('a.html',obj1.traffic[i].time+'s  '+obj1.traffic[i]['total-bytes']+'B  '+speed+'<br>','utf-8',function(err){
								if(err){
									throw err;
								}
							})
						}
					}
			},2000);
		},2500);
	}
	app.get('/captureStart',function(req,res){
		//状态由按钮可否点击说明
		var flag1={};
		callback1();
	});
	app.get('/captureStop',function(req,res){
		// clearInterval(timer);
		// capturedata={};
		// res.json('stop');
		var stop={};
		connection.sendMessage2('10.10.88.172','1234','type=pcap&key=stop',stop);
		var timer1=setInterval(function(){
			if(stop.over==true){
				if(stop.data.status!='success'){
					stop={};
					connection.sendMessage2('10.10.88.172','1234','type=pcap&key=stop',stop);
				}
				if(stop.data.status=='success'){
					clearInterval(timer);
					clearInterval(timer1);
					capturedata={};
					res.json('已停止');
				}
			}
		},300);
	});
}