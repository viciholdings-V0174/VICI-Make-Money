var JoyStick = function(posX, posY, size){
	/* initialize */
	this.posX = posX;
	this.posY = posY;
	this.size = size - (size % 4);
	this.rad = this.size / 4;
	this.output = {};

	/* create container element */
	this.container = document.createElement('div');
	document.getElementsByTagName('body')[0].appendChild(this.container);
	/**/
	var containerStyle = this.container.style;
	containerStyle['position'] = 'absolute'; 
	containerStyle['left'] = this.posX + 'px';
	containerStyle['top'] = this.posY + 'px';
	containerStyle['display'] = 'block';
	containerStyle['width'] = this.size + 'px';
	containerStyle['height'] = this.size + 'px';
	containerStyle['background-image'] = 'url(\"myboard_t2.png\")';
	containerStyle['background-size'] = this.size + 'px ' + this.size + 'px';
	containerStyle['opacity'] = 0.6;

	/* create stick element */
	this.stick = document.createElement('div');
	this.container.appendChild(this.stick);
	/**/
	var stickStyle = this.stick.style;
	stickStyle['position'] = 'absolute'; 
	stickStyle['left'] = this.rad + 'px';
	stickStyle['top'] = this.rad + 'px';
	stickStyle['display'] = 'block'; 
	stickStyle['width'] = (2 * this.rad) + 'px';
	stickStyle['height'] = (2 * this.rad) + 'px';
	stickStyle['border-radius'] = this.rad + 'px';
	stickStyle['background-color'] = '#cc0000';

	/* set EventListener for touching events */
	this.container.addEventListener('touchstart', this.handleTouch.bind(this));
	this.container.addEventListener('touchmove', this.handleTouch.bind(this));
	this.container.addEventListener('touchend', this.reset.bind(this));
	this.container.addEventListener('touchcancel', this.reset.bind(this));

	this.container.addEventListener('mousedown', this.handleMouse.bind(this));
	this.container.addEventListener('mousemove', this.handleMouse.bind(this));
	this.container.addEventListener('mouseup', this.reset.bind(this));
};

JoyStick.prototype.handleTouch = function(evt){
	evt.preventDefault();

	/* the x,y-coordinate given by changedTouches is relative to the webpage */
	/* calculate delta x,y from the origin of joystick */
	var touches = evt.changedTouches;
	var tdX = touches[0].pageX - this.posX - (2 * this.rad);
	var tdY = touches[0].pageY - this.posY - (2 * this.rad);
	var tdist = Math.sqrt(tdX * tdX + tdY * tdY);

	/**/
	if (tdist > this.rad) {
		this.output.dist = this.rad;
		this.output.dX = this.rad * tdX / tdist;
		this.output.dY = this.rad * tdY / tdist;
	} else {
		this.output.dist = tdist;
		this.output.dX = tdX;
		this.output.dY = tdY;
	}
	this.output.radian = Math.atan2(this.output.dY, this.output.dX);
	this.output.degree = this.output.radian * 180 / Math.PI;

	/**/
	this.stick.style['left'] = (this.output.dX + this.rad) + 'px';
	this.stick.style['top'] = (this.output.dY + this.rad) + 'px';
}

JoyStick.prototype.handleMouse = function(evt){
	evt.preventDefault();

	/* calculate delta x,y from the origin of joystick */
	var tdX = evt.clientX - this.posX - (2 * this.rad);
	var tdY = evt.clientY - this.posY - (2 * this.rad);
	var tdist = Math.sqrt(tdX * tdX + tdY * tdY);

	/**/
	if (tdist > this.rad) {
		this.output.dist = this.rad;
		this.output.dX = this.rad * tdX / tdist;
		this.output.dY = this.rad * tdY / tdist;
	} else {
		this.output.dist = tdist;
		this.output.dX = tdX;
		this.output.dY = tdY;
	}
	this.output.radian = Math.atan2(this.output.dY, this.output.dX);
	this.output.degree = this.output.radian * 180 / Math.PI;

	/**/
	this.stick.style['left'] = (this.output.dX + this.rad) + 'px';
	this.stick.style['top'] = (this.output.dY + this.rad) + 'px';
}

JoyStick.prototype.reset = function(evt){
	evt.preventDefault();

	/* reset */
	this.output.dist = 0;
	this.output.dX = 0;
	this.output.dY = 0;
	this.output.radian = undefined;
	this.output.degree = undefined;

	/**/
	this.stick.style['left'] = this.rad + 'px';
	this.stick.style['top'] = this.rad + 'px';
}

JoyStick.prototype.getOutput = function(){
	return this.output;
}