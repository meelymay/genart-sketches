let w = 1000;
let h = 700;

let colors;
let horizon = h * 0.6;
let bg;

function setup() {
	createCanvas(w, h);
	strokeWeight(2);

	colors = new ColorSet(3, 20);

 	bg = colors.background;
	background(bg.c());

	let tree = new Tree(w/2, h, colors.chooseColor(), w, h * 0.8);
	tree.draw();

	noLoop();
}

function draw() {
	
}

function keyTyped() {
  if (key === 's') {
    saveCanvas('trees_' + colors.toHash(), 'png')
  }
}