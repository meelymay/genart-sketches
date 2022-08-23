let w = 1000;
let h = 1200;

let vanX = 300;
let vanY = 200;
let zDistance = 200;
let eyeX = vanX;
let eyeY = vanY;

let roadLoc;

let colors;
let bg;

let roadW = 280;
let sidewalkW = 100;

class BuildingPersp {
	constructor(z, width, height, depth) {
		this.z = z;
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.color = colors.chooseColor();
	}

	draw() {
		let buildZ1 = this.z;
		let buildZ2 = this.z + this.depth;
		let buildH = this.height;

		fill(this.color.c());
		stroke(this.color.r/4, this.color.g/4, this.color.b/4);

		drawQuadOnXYPlane(roadLoc - roadW/2 - sidewalkW, 0, this.z, this.width, this.height);
		drawQuadOnYZPlane(roadLoc - roadW/2 - sidewalkW, 0, this.z, this.height, this.depth);

		// beginShape();
		// let coords = toPicPlaneCoords(roadLoc - roadW/2 - sidewalkW, 0, buildZ1);
		// vertex(coords[0], coords[1]);
		// coords = toPicPlaneCoords(roadLoc - roadW/2 - sidewalkW, 0, buildZ2);
		// vertex(coords[0], coords[1]);
		// coords = toPicPlaneCoords(roadLoc - roadW/2 - sidewalkW, buildH, buildZ2);
		// vertex(coords[0], coords[1]);
		// coords = toPicPlaneCoords(roadLoc - roadW/2 - sidewalkW, buildH, buildZ1);
		// vertex(coords[0], coords[1]);
		// coords = toPicPlaneCoords(roadLoc - roadW/2 - sidewalkW, 0, buildZ1);
		// vertex(coords[0], coords[1]);
		// endShape();
	}
}

function toPicPlaneCoords(x, y, z) {	
	let xPrime = eyeX + (x - eyeX) * zDistance / (z + zDistance);
	let yPrime = eyeY + (y - eyeY) * zDistance / (z + zDistance);

	return [xPrime, yPrime];
}

function drawQuadOnYZPlane(x, y, z, h, d) {
	beginShape();
	let coords = toPicPlaneCoords(x, y, z);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x, y, z + d);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x, y + h, z + d);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x, y + h, z);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x, y, z);
	vertex(coords[0], coords[1]);
	endShape();
}

function drawQuadOnXYPlane(x, y, z, w, h) {
	beginShape();
	let coords = toPicPlaneCoords(x, y, z);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x + w, y, z);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x + w, y + h, z);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x, y + h, z);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x, y, z);
	vertex(coords[0], coords[1]);
	endShape();
}

function drawQuadOnXZPlane(x, y, z, w, d) {
	beginShape();
	let coords = toPicPlaneCoords(x, y, z);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x, y, z + d);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x + w, y, z + d);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x + w, y, z);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(x, y, z);
	vertex(coords[0], coords[1]);
	endShape();
}

function setup() {
	createCanvas(w, h);
	strokeWeight(2);

	colors = new ColorSet(3, 25);
	bg = colors.background;

	roadLoc = 0;

	background(bg.c());

	stroke(colors.chooseColor().c());

	noLoop();
}

function draw() {
	push();

	translate(w/2, h/2);
	scale(1, -1);

	// horizon
	line(-w, vanY, w, vanY);

	let x;
	let y;
	let z;
	let x2;
	let coords;
	let coords2;

	// road
	y = 0;
	x = roadLoc - roadW/2;
	z = - zDistance + .01;

	coords = toPicPlaneCoords(x, y, z);
	fill(0, 255, 0);
	line(coords[0], coords[1], vanX, vanY);
	z = -sidewalkW/2;
	x = roadLoc + roadW/2;
	coords = toPicPlaneCoords(x, y, z);
	line(coords[0], coords[1], vanX, vanY);

	// sidewalks
	z = - zDistance + .01;
	x = roadLoc - roadW/2 - sidewalkW;
	coords = toPicPlaneCoords(x, y, z);
	line(coords[0], coords[1], vanX, vanY);
	z = -sidewalkW/2;
	x = roadLoc + roadW/2 + sidewalkW;
	coords = toPicPlaneCoords(x, y, z);
	line(coords[0], coords[1], vanX, vanY);

	// sidewalk lines
	for (z = -zDistance + .01; z < 20 * zDistance; z += 30) {
		x = roadLoc - roadW/2 - sidewalkW;
		x2 = roadLoc - roadW/2;
		coords = toPicPlaneCoords(x, y, z);
		coords2 = toPicPlaneCoords(x2, y, z);
		line(coords[0], coords[1], coords2[0], coords2[1]);

		if (z > -sidewalkW/2) {
			x = roadLoc + roadW/2 + sidewalkW;
			x2 = roadLoc + roadW/2;
			coords = toPicPlaneCoords(x, y, z);
			coords2 = toPicPlaneCoords(x2, y, z);
			line(coords[0], coords[1], coords2[0], coords2[1]);
		}
	}

	// sidewalk corner
	coords = toPicPlaneCoords(roadLoc + roadW/2, 0, 0);
	coords2 = toPicPlaneCoords(1000, 0, 0);
	line(coords[0], coords[1], coords2[0], coords2[1]);
	coords = toPicPlaneCoords(roadLoc + roadW/2, 0, -sidewalkW/2);
	coords2 = toPicPlaneCoords(1000, 0, -sidewalkW/2);
	line(coords[0], coords[1], coords2[0], coords2[1]);

	// experiment
	let lastZ = -100;
	let builds = [];
	for (let i = 0; i < 20; i++) {
		let width = randomGaussian(200, 20);
		let depth = max(20, randomGaussian(150, 50));
		let height = randomGaussian(600, 200);
		builds.push(new BuildingPersp(lastZ, -width, height, depth));
		lastZ += depth + 10;
	}

	for (let b = builds.length-1; b >= 0; b--) {
		builds[b].draw();
	}

	drawQuadOnXYPlane(roadLoc + roadW/2 + sidewalkW, 0, 0, 500, 400, 500);

	pop();
}

function keyTyped() {
  if (key === 's') {
    saveCanvas('city_persp_' + colors.toHash(), 'png')
  }
}