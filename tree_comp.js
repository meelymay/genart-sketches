let w = 1200;
let h = 1000;

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
	let nRows = 2;
	let nCols = 3;
	for (let r = 0; r < nRows; r++) {
		for (let c = 0; c < nCols; c++) {
			let x = c * w/nCols;
			let y = r * h/nRows;

			noFill();
			rect(x, y, w/nCols, h/nRows);

			let treeW = w/nCols * .75;
			let treeH = h/nRows;
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