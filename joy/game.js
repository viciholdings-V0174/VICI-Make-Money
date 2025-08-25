var GameCanvas = function(width, height){
	/* initialize */
	this.components = [];

	/* create canvas element */
	this.canvas = document.createElement('canvas');
	this.canvas.style.position = 'absolute'; 
	this.canvas.style.left = 0 + 'px';
	this.canvas.style.top = 0 + 'px';
	this.canvas.style.display = 'block'; 
	this.canvas.style.width = width + 'px';
	this.canvas.style.height = height + 'px';
	this.canvas.style['background-color'] = '#e0e0e0';
	this.canvas.width = width;
	this.canvas.height = height;
	document.getElementsByTagName('body')[0].appendChild(this.canvas);

	/**/ 
	this.context = this.canvas.getContext("2d");
};

GameCanvas.prototype.update = function(){
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	/**/
	for(var i in this.components){
		var c = this.components[i];
		this.context.fillStyle = c.color;
		this.context.fillRect(c.x, c.y, c.width, c.height);
	}
}

GameCanvas.prototype.createComponent = function(){
	this.components.push(new Component(30, 30, "red", 10, 10));
}

GameCanvas.prototype.moveComponent = function(movement){
	this.components[0].x += Math.round(movement.dx * 10);
	this.components[0].y += Math.round(movement.dy * 10);
}

/**/
function Component(width, height, color, x, y) {
	this.width = width;
	this.height = height;
	this.color = color;
	this.x = x;
	this.y = y;
}