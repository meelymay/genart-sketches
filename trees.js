// let xAccJitter = 0.01;
// let thickJitter = 0.2;
// let thickVelJitter = 0.1;

let dyMult = 400;

let maxThickMult = 20.0;
let startThickMult = 0.8;
let taperStop = 0.5;
let taperThickMult = 7;

let branchMaxThickMult = 0.9;
let newBranchMaxThickMult = 1.05;

let velVar = 0.25;
let accVar = 0.01;
let velMult = 0.7;
let accMult = 0.7;
let maxVelPow = 2;
let trueDxMult = 1.7;

let taperingMult = 0.95;
let taperVar = 0.05;

let thickVar = 0.6;
let minThickMult = 50;

// reset
let minThick = 10;
let maxVel = 3;

class Tree {
  constructor(x, y, c, width, height) {
    this.ogX = x;
    this.ogY = y;
    this.height = height;
    this.width = width;
    this.dy = height/ dyMult;
    this.maxThick = height/maxThickMult;
    this.branches = [new Branch(
      x, y, 
      this.maxThick * startThickMult, this.maxThick,
      c, 
      0, this.dy,
      this.height,
      this.ogX, this.ogY)];

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
        let taperThick = taperThickMult * (this.height/(this.height - branch.curHeight()));
        let centerDist = abs(branch.x - this.ogX);
        taperThick *= (1 + centerDist/this.width);
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
          branch.maxThick = max(branch.maxThick * branchMaxThickMult, branch.thickness * newBranchMaxThickMult);
          let ogX = branch.x+branch.run()/2
          this.branches.push(
            new Branch(
              ogX,
              branch.y+branch.rise()/2 + branch.dy,
              branch.thickness,
              branch.maxThick,
              branch.color,
              branch.dx,
              branch.dy,
              this.height,
              branch.x,
              this.ogY));
          branch.ogX = branch.x;
          branch.x -= branch.run()/2;
          branch.y -= branch.rise()/2;
        }
      }
    }
  }
}

class Branch {
  constructor(x, y, thickness, maxThick, color, dx, dy, height, ogX, ogY) {
    this.ogX = ogX;
    this.ogY = ogY;
    this.x = x;
    this.dx = dx;
    this.ddx = 0;
    this.y = y;
    this.dy = dy;
    this.thickness = thickness;
    this.maxThick = maxThick;
    this.dThick = .1;
    this.color = color;
    this.height = height;
  }

  step(taper) {
    // * Math.pow(this.curHeight()/this.height, trueDxMult);
    let dxMult = 2*(this.curHeight())/this.height;
    console.log("dx mult", dxMult);
    this.trueDx = this.dx * dxMult;
    let ogDist = this.ogX - this.x;
    let dirShift = 0;
    if (ogDist != 0 && this.curHeight()/this.height > .1) {
      dirShift = .5 * abs(ogDist)/ogDist;
    }
    this.x += this.trueDx - dirShift;
    // console.log('OGDIST', ogDist);
    // if (ogDist != 0) {
    //   this.x += -1 * abs(ogDist)/ogDist;
    // }
    this.dx += randomGaussian(this.ddx, velVar);
    this.ddx += randomGaussian(0, accVar);
    this.y -= this.dy;


    let wat = 1 + Math.pow(this.curHeight()/this.height, maxVelPow);
    if (abs(this.dx) > maxVel * wat) {
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
    this.dThick += randomGaussian(0, thickVar * this.curHeight() / this.height);

    if (this.thickness < minThick) {
      this.dThick = 0;
      this.thickness += 1;
    }
  }

  curHeight() {
    let c = this.ogY - this.y;
    // console.log(this.ogX, this.ogY, c);
    return c;
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
    let startY = (this.ogY  - this.curHeight()) - rise / 2;
    let endX = this.x + run / 2;
    let endY = (this.ogY - this.curHeight()) + rise / 2;
    // line(this.x, this.y, this.x + this.thickness, this.y);
    line(startX, startY, endX, endY);
  }
}