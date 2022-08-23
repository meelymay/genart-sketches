let xAccJitter = 0.01;
let thickJitter = 0.2;
let thickVelJitter = 0.1;

class Tree {
  constructor(x, y, c, width, height) {
    this.height = height;
    this.width = width;
    this.dy = 2.5;
    this.maxThick = 38;
    this.branches = [new Branch(x, y, 30, this.maxThick, c, 0, this.dy)];
  }

  draw() {
    for (let i = 0; i < height/this.dy; i++) {
      for (let b = 0; b < this.branches.length; b++) {
        let branch = this.branches[b];

        // come to a point and stop
        if (branch.thickness < 0.5) {
          continue;
        }

        // taper if thinner than...
        let taperThick = 7 * (this.height/branch.y/2);
        let centerDist = abs(branch.x - this.width/2);
        taperThick *= (1 + centerDist**1.5/this.width);
        if (branch.thickness < taperThick) {
          branch.draw();
          branch.step(true);
          continue;
        }

        branch.draw();
        branch.step(false);

        // branch if thicker
        if (branch.thickness > min(branch.maxThick, this.maxThick * (.5 + .5*(branch.y/this.height)))) {
          branch.thickness /= 2;
          branch.maxThick = max(branch.maxThick * 0.9, branch.thickness*1.2);
          this.branches.push(
            new Branch(
              branch.x+branch.run()/2,
              branch.y+branch.rise()/2, 
              branch.thickness,
              branch.maxThick,
              branch.color,
              branch.dx,
              branch.dy));
          branch.x -= branch.run()/2;
          branch.y -= branch.rise()/2;
        }
      }
    }
  }
}

class Branch {
  constructor(x, y, thickness, maxThick, color, dx, dy) {
    this.ogX = x;
    this.x = x;
    this.dx = dx;
    this.ddx = 0;
    this.y = y;
    this.dy = dy;
    this.thickness = thickness;
    this.maxThick = maxThick;
    this.dThick = 0;
    this.color = color;
  }

  step(taper) {
    this.trueDx = this.dx * (1 - (this.y/height)**3);
    this.x += this.trueDx;
    this.dx += randomGaussian(this.ddx, .25);
    this.ddx += randomGaussian(0, .01);
    this.y -= this.dy;

    if (abs(this.dx) > 3) {
      this.dx *= 0.7;
      this.ddx *= -0.7;
      // this.dx -= abs(this.dx)/this.dx * .25 * this.dx;
    }

    if (taper) {
      this.thickness *= randomGaussian(0.95, 0.05);
      return;
    }

    this.thickness += this.dThick;
    // this.thickness += randomGaussian(0, 1.5);
    this.dThick += randomGaussian(0, .1);

    if (this.thickness < 10) {
      this.dThick = 0;
      this.thickness += 1;
    }
  }

  run() {
    return this.thickness/(this.trueDx**2/this.dy**2 +1)**0.5;
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