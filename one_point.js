let w = 1000;
let h = 700;

let vanX = 0;
let vanY = 75;
let zDistance = 1000;
let eyeX = 0;
let eyeY = vanY;

let roadLoc;

let colors;
let bg;

let roadW = 120;
let sidewalkW = 30;

function toPicPlaneCoords(x, y, z) {	
	let xPrime = eyeX + (x - eyeX) * zDistance / (z + zDistance);
	let yPrime = eyeY + (y - eyeY) * zDistance / (z + zDistance);

	return [xPrime, yPrime];
}

function setup() {
	createCanvas(w, h);
	strokeWeight(2);

	colors = new ColorSet(3, 25);
	bg = colors.background;

	roadLoc = 0;

	background(200);  // bg.c());

	stroke(0); // colors.chooseColor().c());

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
	ellipse(coords[0], coords[1], 10, 10);
	line(coords[0], coords[1], vanX, vanY);
	x = roadLoc + roadW/2;
	coords = toPicPlaneCoords(x, y, z);
	line(coords[0], coords[1], vanX, vanY);

	// sidewalks
	x = roadLoc - roadW/2 - sidewalkW;
	coords = toPicPlaneCoords(x, y, z);
	line(coords[0], coords[1], vanX, vanY);
	x = roadLoc + roadW/2 + sidewalkW;
	coords = toPicPlaneCoords(x, y, z);
	line(coords[0], coords[1], vanX, vanY);

	// sidewalk lines
	for (z = -zDistance + .01; z < 10 * zDistance; z += 30) {
		x = roadLoc - roadW/2 - sidewalkW;
		x2 = roadLoc - roadW/2;
		coords = toPicPlaneCoords(x, y, z);
		coords2 = toPicPlaneCoords(x2, y, z);
		line(coords[0], coords[1], coords2[0], coords2[1]);

		x = roadLoc + roadW/2 + sidewalkW;
		x2 = roadLoc + roadW/2;
		coords = toPicPlaneCoords(x, y, z);
		coords2 = toPicPlaneCoords(x2, y, z);
		line(coords[0], coords[1], coords2[0], coords2[1]);
	}

	// experiment
	let buildZ1 = -500;
	let buildZ2 = 100;
	let buildH = 100;

	fill(255,0,0);
	beginShape();
	coords = toPicPlaneCoords(roadLoc - roadW/2 - sidewalkW, 0, buildZ1);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(roadLoc - roadW/2 - sidewalkW, 0, buildZ2);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(roadLoc - roadW/2 - sidewalkW, buildH, buildZ2);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(roadLoc - roadW/2 - sidewalkW, buildH, buildZ1);
	vertex(coords[0], coords[1]);
	coords = toPicPlaneCoords(roadLoc - roadW/2 - sidewalkW, 0, buildZ1);
	vertex(coords[0], coords[1]);
	endShape();

	// let r = 250;
	// let b = 0;
	// noStroke();
	// for (let expZ = -zDistance; expZ < 1000; expZ += 50) {
	// 	fill(r, 0, b);
	// 	let cs = toPicPlaneCoords(roadW/2, 0, expZ);
	// 	ellipse(cs[0], cs[1], 10, 10);
	// 	r -= 25;
	// 	b += 25;
	// }

	pop();
}

function keyTyped() {
  if (key === 's') {
    saveCanvas('city_comp_' + colors.toHash(), 'png')
  }
}