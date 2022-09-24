let h = 700;
let w = 1200;

let squiggles = [];

let colors;

let turnAroundAccel = 0.02;
let accelRange = .05;
let minDistance = 20;
let maxSpeed = 1;
let yRange = 100;
let numLines = 7;
let colorRange = 50;
let stepCount = 0;

class Squiggle {
	constructor(i) {
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

		let upperS = squiggles[this.name - 1];
		let lowerS = squiggles[this.name + 1];
		if (upperS && this.y - upperS.y < minDistance) {
			ddy = turnAroundAccel;
		}
		if (lowerS && lowerS.y - this.y < minDistance) {
			ddy = -turnAroundAccel;
		}

		return randomGaussian(ddy, accelRange);;
	}

	preventCollision() {
		for (let i = 0; i < squiggles.length; i++) {
			let s = squiggles[i];

			if (s.name == this.name) {
				continue;
			}

			let dist = Math.abs(s.y - this.y);
			if (dist < minDistance) {
				// return turnAroundAccel * (this.startY - s.startY) / Math.abs(this.startY - s.startY);
				this.dy = -this.dy;
			}
		}
	}

	step() {
		this.draw();

		// x bounds
  	if (this.x < 0) {
			this.dx = -this.dx;
		}  
		if (this.x > w) {
			noLoop();
			// this.x = 0;
			// this.y = random() * h;
			// this.startY = this.y;
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

		// this.preventCollision();

		this.x += 1; // this.dx;
		this.y += this.dy;
	}

	draw() {
		// fill the mountains with color
		strokeWeight(2);
		stroke(this.color.r, this.color.g, this.color.b);
		line(this.x, this.y, this.x, h);
		
		// draw the line
		noStroke();
		fill(
			this.otherColor.r,
			this.otherColor.g,
			this.otherColor.b);
		ellipse(this.x, this.y, 3, 3);
		let smColorRange = colorRange / 2.0;
		// shade the tops
		for (let i = 0; i < this.spread; i++) {
			fill(
				randomGaussian(this.otherColor.r, smColorRange),
				randomGaussian(this.otherColor.g, smColorRange),
				randomGaussian(this.otherColor.b, smColorRange));

			let shadeRange = this.size*2.0;
			let newShadeRange = shadeRange;
			if (this.name < squiggles.length - 1) {
				let s = squiggles[this.name + 1];
				newShadeRange = (s.y - this.y) / 3.0;
			} else {
				newShadeRange = (h - this.y) / 3.0;
			}
			if (newShadeRange > shadeRange) {
				shadeRange = newShadeRange;
			}

			let x = this.x;
			let y = this.y + Math.abs(randomGaussian(0, shadeRange));
			
			ellipse(x, y, 2, 2);
		}
		// more filler shade
		for (let i = 0; i < this.spread; i++) {
			fill(
				randomGaussian(this.otherColor.r, smColorRange),
				randomGaussian(this.otherColor.g, smColorRange),
				randomGaussian(this.otherColor.b, smColorRange));

			let x = this.x;
			let y = this.y + Math.abs(randomGaussian(0, this.size*1.5));
			ellipse(x, y, 2, 2);
		}

		// draw a stripe
		// strokeWeight(3);
		// stroke(this.color.r, this.color.g, this.color.b);
		// if (stepCount % 10 == 0) {
		// 	if (this.name < squiggles.length - 1) {
		// 		let s = squiggles[this.name + 1];
		// 		line(this.x, this.y, s.x, s.y);
		// 	} else {
		// 		line(this.x, this.y, this.x, h);
		// 	}
		// }
	}
}

function setup() {
	createCanvas(w, h);
	// frameRate(60);
	background(0);

	colors = new ColorSet(3, 25);

	for (let i = 0; i < numLines; i++) {
		squiggles.push(new Squiggle(i));
	}
}

function draw() {
	stepCount++;
	for (let s = 0; s < squiggles.length; s++) {
		squiggles[s].step();
	}
}