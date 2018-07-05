var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/", function(req,res){
	res.render('first');
});

app.post('/index', function(req,res){
	res.cookie('user_name', req.body.nm);
	res.render('index', {name: req.body.nm});
});

app.get("/chat",function(req,res){
	res.render('chat', {name: req.cookies['user_name']});
	console.log(req.cookies['user_name'] + " connected to chat");
});


io.on('connection', function(socket){
  	socket.on('chat message', function(msg){
   	   io.emit('chat message', msg);
  	});

  	socket.on('room booked', function(msg){
  	//	console.log('recieved msg');
  		io.emit('room booked', msg);
  	});

  	socket.on('delete booking', function(msg){
  		io.emit('delete booking', msg);
  	});
});
    
http.listen(3000, function(){
	console.log('Listening on port: 3000');
});