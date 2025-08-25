/* configs */
var kWidth = window.innerWidth;
var kHeight = window.innerHeight;
var kJoystickRad = 60;
var kJotstickBaseSize = kJoystickRad * 4;

/* set canvas size */
var game = new GameCanvas(kWidth, kHeight);
game.createComponent();

/* set joystick size */
var joystick = new JoyStick(0, kHeight - kJotstickBaseSize, kJotstickBaseSize);

setInterval(function(){
	var x = joystick.getOutput();
	console.log(x);
	document.getElementById('debuginfo').innerHTML = x;
	game.moveComponent(x);
	game.update();
}, 30);




showDebug();
//
function showDebug(){
	var dbg = document.createElement('div');
	dbg.id = 'debuginfo';
	document.getElementsByTagName('body')[0].appendChild(dbg);
}
