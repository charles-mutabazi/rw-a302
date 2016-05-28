var five = require('johnny-five');
var express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


var port = 3030;
var board = new five.Board();


// app.use('/public', express.static(__dirname + '/public'));
// app.use('/bower_components', express.static(__dirname + '/bower_components'));

// app.get('/', function(req, res) {
// 	res.sendFile(__dirname + '/index.html');
// });


// johnny-five
board.on('ready', function() {
	console.log('Board is ready :)');

	var servo = new five.Servo({	
		pin: 9, // note this pin (UNO)
		centre: true,
		// range: [60, 110]
	});
	// tilt.to(110); // max turn right
	// tilt.to(60); // max turn left
	// servo.sweep();
	var motor = new five.Motor({
		pins: {
			pwm: 11, //note this pin (UNO)
			dir: 4,
			cdir: 5
		}
	}); 

	board.repl.inject({
		motor: motor,
		servo: servo
	});

	io.on('connection', function(socket){
		console.log("Connected....");

		socket.on("forward", function (data) {
    		motor.forward(255);
    		//socket.emit(data);
    		console.log("Moving Forward....");
    	});

    	socket.on("backward", function (data) {
    		motor.reverse(255);
    		//socket.emit(data);
    		console.log("Moving Backwards....");
    	});

    	socket.on("right_turn", function (data) {
    		servo.to(130);
    		//socket.emit(data);
    		console.log("Turned Right....");
    	});

    	socket.on("left_turn", function (data) {
    		servo.to(60);
    		//socket.emit(data);
    		console.log("Turned Left....");
    	});

    	socket.on("stop", function (data) {
    		motor.brake(500);
    		servo.home();
    		servo.stop();
    		//socket.emit(data);
    		console.log("Robot Stopped....");
    	});

    	socket.on('brake', function(data){
    		motor.brake(500);
    	});

    	socket.on('centre', function(data){
    		servo.home();
    	});
	});

	// motor.on("start", function() {
	// 	console.log("start", Date.now());
	// });

	// motor.on("stop", function() {
	// 	console.log("automated stop on timer", Date.now());
	// 	servo.home();
	// 	servo.stop();
	// });

	// motor.on("brake", function() {
	// 	console.log("automated brake on timer", Date.now());
	// 	servo.stop();
	// });

	// motor.on("forward", function() {
	// 	console.log("forward", Date.now());
	// 	servo.max();
	//     // demonstrate switching to reverse after 5 seconds
	//     board.wait(5000, function() {
	//     	motor.reverse(150);
	//     });
	// });

	// motor.on("reverse", function() {
	// 	console.log("reverse", Date.now());
	// 	servo.min();

	//     // demonstrate braking after 5 seconds
	//     board.wait(5000, function() {
	// 		// Brake for 500ms and call stop()
	// 		motor.brake(500);
	//   	});
	// });

 //  // set the motor going forward
 //  motor.forward(150);

 this.on('exit', function(){
 	io.emit('server_exit');
 	servo.home();
 	servo.stop();
 })

});


server.listen(port, function() {
	console.log('Server listening on port: ' + port);
});