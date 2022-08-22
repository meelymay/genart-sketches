// let h = 700;
// let w = 1200;

// let squiggles = [];

// let colors;

let turnAroundAccel = 0.02;
let accelRange = .05;
let minDistance = 20;
let maxSpeed = 1;
let yRange = 100;
let numLines = 7;
let colorRange = 50;
let stepCount = 0;

class GradMountains {
	constructor(y, w, h, numLines) {
		this.y = y;
		this.w = w;
		this.h = h;

		let squiggles = [];
		squiggles.push(new FlatSquiggle(0, 0, this));
		for (let i = 1; i < numLines; i++) {
			squiggles.push(new Squiggle(i, this));
		}
		squiggles.push(new FlatSquiggle(numLines, h, this));
		this.squiggles = squiggles;
	}

	draw() {
		for (let i = 0; i < w; i++) {
			stepCount++;
			for (let s = 0; s < this.squiggles.length; s++) {
				this.squiggles[s].step();
			}
		}
	}
}

class FlatSquiggle {
	constructor(i, y, parent) {
		this.parent = parent;
		this.name = i;
		this.y = y;
		this.x = 0;
		this.color = colors.chooseColor();
	}

	step() {
		this.draw();

		this.x += 1;
	}

	draw() {
		// fill the mountains with color
		strokeWeight(2);

		if (this.name > 0) {
			let otherS = this.parent.squiggles[this.name - 1];			
			linearGradientStroke(this.x, this.y, otherS.x, otherS.y, this.color, otherS.color);
			line(this.x, this.y, this.x, otherS.y);
		}
	}
}

class Squiggle {
	constructor(i, parent) {
		this.parent = parent;
		this.name = i;
		this.startY = i * h/(numLines*1.0) + random() * h/numLines;
		this.y = this.startY;
		this.x = 0;
		this.dx = 1;
		this.dy = .1;
		this.size = 10;
		this.spread = 20;

		// this.color = new Color(random()*255, random()*255, random()*255);
		this.color = colors.chooseColor();
		this.otherColor = new Color(
			this.color.r - colorRange,
			this.color.g - colorRange,
			this.color.b - colorRange);
	}

	getAccel() {
		let ddy = 0;
		if (this.dy > maxSpeed) { 
			ddy = -turnAroundAccel;
		}
		if (this.y > this.startY + yRange) {
			return -turnAroundAccel;
		}
		if (this.dy < -maxSpeed) {
			ddy = turnAroundAccel;
		}
		if (this.y < this.startY - yRange) {
			return turnAroundAccel;
		} 

		let upperS = this.parent.squiggles[this.name - 1];
		let lowerS = this.parent.squiggles[this.name + 1];
		if (upperS && this.y - upperS.y < minDistance) {
			ddy = turnAroundAccel;
		}
		if (lowerS && lowerS.y - this.y < minDistance) {
			ddy = -turnAroundAccel;
		}

		return randomGaussian(ddy, accelRange);;
	}

	step() {
		this.draw();

		// x bounds
  	if (this.x < 0) {
			this.dx = -this.dx;
		}  
		if (this.x > w) {
			noLoop();
		}
		let ddx = 0;
		if (this.dx > maxSpeed) {    
			ddx = -0.1;
		}
		if (this.dx < 0) {
			ddx = 0.1;
		}  

		// y bounds
		if (this.y > h || this.y < 0) {
			this.dy = -this.dy;
		}
		let ddy = this.getAccel();
		
		this.dx += randomGaussian(ddx, 0.05);
		this.dy += ddy;

		this.x += 1; // this.dx;
		this.y += this.dy;
	}

	draw() {
		// fill the mountains with color
		strokeWeight(2);

		if (this.name > 0) {
			let otherS = this.parent.squiggles[this.name - 1];			
			linearGradientStroke(this.x, this.y, otherS.x, otherS.y, this.color, otherS.color);
			line(this.x, this.y, this.x, otherS.y);
		}
	}
}

// function setup() {
// 	createCanvas(w, h);

// 	colors = new ColorSet(3, 20);
// 	background(colors.background.r, colors.background.g, colors.background.b);

// 	squiggles.push(new FlatSquiggle(0, 0));
// 	for (let i = 1; i < numLines; i++) {
// 		squiggles.push(new Squiggle(i));
// 	}
// 	squiggles.push(new FlatSquiggle(numLines, h));
// }

// function draw() {
// 	stepCount++;
// 	for (let s = 0; s < squiggles.length; s++) {
// 		squiggles[s].step();
// 	}
// }

function keyTyped() {
  if (key === 's') {
    saveCanvas('grad_ellipse_' + colors.toHash(), 'png')
  }
}