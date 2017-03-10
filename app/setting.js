var fs=require('fs');
exports.host=function(setting){
	fs.readFile('setting.cfg','utf8',function(err,data){
		if(err){
			throw err;
		}else{
			var ca={};
			ca.ip=data.split(',')[0].split(':')[1];
			ca.user=data.split(',')[1].split(':')[1];
			ca.pass=data.split(',')[2].split(':')[1];
			setting.ca=ca;
			
			var host=[];
			regexp=/host\d:(.*),user:(.+),pass:(.+),netName:(.+),/g;
			var match=[];
			while(match=regexp.exec(data)){
				var obj={};
				obj.ip=match[1];
				obj.user=match[2];
				obj.pass=match[3];
				obj.netName=match[4];
				host.push(obj);
			}
			setting.host=host;
		}
	})
}