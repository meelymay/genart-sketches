// let xAccJitter = 0.01;
// let thickJitter = 0.2;
// let thickVelJitter = 0.1;

let dyMult = 400;

let maxThickMult = 20.0;
let startThickMult = 0.8;
let taperStop = 0.5;
let taperThickMult = 7;
let horizTaperMult = 1;

let branchMaxThickMult = 0.9;
let newBranchMaxThickMult = 1.1;

let mysteryHeightMult = 100;

let trueDxMult = 1;
let velVar = 0.25;
let accVar = 0.01;
let velMult = 0.7;
let accMult = 0.7;
let maxVelPow = 1;

let taperingMult = 0.95;
let taperVar = 0.05;

let thickVar = 0.1;
let minThickMult = 45;

// reset
let minThick = 10;
let maxVel = 3;

class Tree {
  constructor(x, y, c, width, height) {
    this.ogX = x;
    this.height = height;
    this.width = width;
    this.dy = height/ dyMult;
    this.maxThick = height/maxThickMult;
    this.branches = [new Branch(x, y, this.maxThick * startThickMult, this.maxThick, c, 0, this.dy, this.height)];

    minThick = height/minThickMult;
    maxVel = width/250;
  }

  draw() {
    for (let i = 0; i < height/this.dy; i++) {
      for (let b = 0; b < this.branches.length; b++) {
        let branch = this.branches[b];

        // come to a point and stop
        if (branch.thickness < taperStop) {
          continue;
        }

        // taper if thinner than... (or too many branches)
        let taperThick = taperThickMult * (this.height/branch.y);
        let centerDist = abs(branch.x - this.ogX);
        taperThick *= (1 + centerDist**horizTaperMult/this.width);
        if (branch.thickness < taperThick || this.branches.length > 100) {
          branch.draw();
          branch.step(true);
          continue;
        }

        branch.draw();
        branch.step(false);

        // branch if thicker
        let maxHeightThick = this.maxThick * (.5 + .5*(branch.y/this.height));
        let maxThick = min(branch.maxThick, maxHeightThick);
        if (branch.thickness > maxThick) {
          branch.thickness /= 2;
          branch.maxThick = max(branch.maxThick * branchMaxThickMult, branch.thickness*newBranchMaxThickMult);
          this.branches.push(
            new Branch(
              branch.x+branch.run()/2,
              branch.y+branch.rise()/2, 
              branch.thickness,
              branch.maxThick,
              branch.color,
              branch.dx,
              branch.dy,
              this.height));
          branch.x -= branch.run()/2;
          branch.y -= branch.rise()/2;
        }
      }
    }
  }
}

class Branch {
  constructor(x, y, thickness, maxThick, color, dx, dy, height) {
    this.x = x;
    this.dx = dx;
    this.ddx = 0;
    this.y = y;
    this.dy = dy;
    this.thickness = thickness;
    this.maxThick = maxThick;
    this.dThick = 0;
    this.color = color;
    this.height = height * mysteryHeightMult;
  }

  step(taper) {
    this.trueDx = this.dx * Math.pow(1 - this.y/this.height, trueDxMult);
    this.x += this.trueDx;
    this.dx += randomGaussian(this.ddx, velVar);
    this.ddx += randomGaussian(0, accVar);
    this.y -= this.dy;

    if (abs(this.dx) > maxVel) { // * (1 - Math.pow(1 - this.y/this.height, maxVelPow))) {
      this.dx *= velMult;
      this.ddx *= -accMult;
      // this.dx -= abs(this.dx)/this.dx * .25 * this.dx;
    }

    if (taper) {
      this.thickness *= randomGaussian(taperingMult, taperVar);
      return;
    }

    this.thickness += this.dThick;
    // this.thickness += randomGaussian(0, 1.5);
    this.dThick += randomGaussian(0, thickVar);

    if (this.thickness < minThick) {
      this.dThick = 0;
      this.thickness += 1;
    }
  }

  run() {
    return this.thickness/(this.trueDx**2/this.dy**2 + 1)**0.5;
  }

  rise() {
    return this.run()*this.trueDx/this.dy;
  }

  draw() {
    stroke(0);
    let run = this.run();
    let rise = this.rise();
    let startX = this.x - run / 2;
    let startY = this.y - rise / 2;
    let endX = this.x + run / 2;
    let endY = this.y + rise / 2;
    // line(this.x, this.y, this.x + this.thickness, this.y);
    line(startX, startY, endX, endY);
  }
}