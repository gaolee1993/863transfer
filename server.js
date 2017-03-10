var express=require('express'),
	mongoose=require('mongoose'),
	bodyParser=require('body-parser'),
	methodOverride=require('method-override'),
	session=require('express-session'),
	cookieParser=require('cookie-parser');

var app=express();
mongoose.connect("mongodb://localhost/transfer");
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
	secret:"123456"
})); 
app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static('./public'));
require('./app/routes/indexroute.js')(app);

app.listen(3000);
module.exports=app;

