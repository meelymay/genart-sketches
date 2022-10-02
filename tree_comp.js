let w = 1200;
let h = 1200;

let colors;
let horizon = h * 0.6;
let bg;

function setup() {
	createCanvas(w, h);
	strokeWeight(1);

	colors = new ColorSet(3, 20);

 	bg = colors.background;
	background(bg.c());

	// random()*h/2 + h/4
	let nRows = 3;
	let nCols = 3;
	for (let r = 0; r < nRows; r++) {
		for (let c = 0; c < nCols; c++) {
			let x = c * w/nCols;
			let y = r * h/nRows;

			noFill();

			let treeW = w/nCols * .75;
			let treeH = h/nRows * 1.5;
			rect(x, y, w/nCols, w/nCols);
			let tree = new Tree(x + w/nCols/2, y + h/nRows, colors.chooseColor(), treeW, treeH);
			tree.draw();
		}		
	}

	noLoop();
}

function draw() {
	
}

function keyTyped() {
  if (key === 's') {
    saveCanvas('trees_' + colors.toHash(), 'png')
  }
}