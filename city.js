class Building {
  constructor(x, w, h, horizon, canvasHeight) {
    this.x = x;
    this.w = w;
    this.h = h;
    this.horizon = horizon * 1.25;
    this.color = colors.chooseColor();
    this.canvasHeight = canvasHeight;
  }

  draw() {
  	noStroke();
    fill(this.color.r, this.color.g, this.color.b);
    // horizon was height * 0.8
    rect(this.x - this.w/2, this.horizon - this.h, this.w, this.h);

    linearGradientFill(0, this.horizon * .9, 0, this.canvasHeight * .9, this.color, bg);
    rect(this.x - this.w/2, this.horizon, this.w, this.canvasHeight - this.horizon);
  }
}

class City {
	constructor(horizon, numBuilds, canvasHeight) {
		this.horizon = horizon;
		this.numBuilds = numBuilds;
		this.minWidth = 15;
	 	this.minHeight = 30;

	 	let buildings = [];
	 	let build;

	 	// draw BG buildings
		for (let b = 0; b < this.numBuilds/4; b++) {
	    let x = randomGaussian(width/2, width/6);
	    let w = randomGaussian(30, 15);
	    let h = max(0, randomGaussian(height/2.5 - abs(width/2 - x) * 0.5, 80));
	    
	    if (w < this.minWidth || h < this.minHeight) {
	      b -= 1;
	      continue;
	    }

	    build = new Building(x, w, h, horizon, canvasHeight);
	    buildings.push(build);
	    // build.draw();
	  }

	  // spread out
	  for (let b = 0; b < this.numBuilds; b++) {
	    let xRange = width - 200;
	    let x = width/2 + random() * xRange - xRange/2;
	    let w = randomGaussian(30, 15);
	    let h = max(0, randomGaussian(height/3 - abs(width/2 - x) * 0.8, 80));
	    
	    if (w < this.minWidth || h < this.minHeight) {
	      b -= 1;
	      continue;
	    }

	    build = new Building(x, w, h, horizon, canvasHeight);
	    buildings.push(build);
	    // build.draw();
	  }

	  this.buildings = buildings;
	}

	draw() {
		for (let b = 0; b < this.buildings.length; b++) {
			let build = this.buildings[b];
			build.draw();
		}
	}
}