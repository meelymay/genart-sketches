let NUM_SHAPES = 3;
let LOOPING = true;
let MIN_DIST = 25;

let centerX;
let centerY;

let theta = 0;
let startR = 100;
let r = startR;
let dr = 0;

let colorSet;

let shapes = [];

class RadialShape {
  constructor(name, x, y) {
    this.name = name;
    this.centerX = x;
    this.centerY = y;
    this.borderPoints = [];
    this.c1 = colorSet.chooseColor();
    this.c2 = colorSet.chooseColor();

    let theta = 0;
    let startR = 100;
    let r = startR;

    while (theta < 2 * PI) {
      // let x = r * cos(theta);
      // let y = r * sin(theta);

      this.borderPoints.push(new RadialPoint(r, theta));
      
      theta += 0.02;
      if (theta > 2*PI - 0.3) {
        r += (startR - r) * 0.1;
      } else {
        dr += randomGaussian(0, .2);
        r += dr;

        if (r > 200 || r < 30) {
          dr *= -1;
        }

        if (abs(dr) > 2) {
          dr = 0;
        }
      }
    }
  }

  getAbsolutePoints(rFactor) {
    let points = [];
    for (let i = 0; i < this.borderPoints.length; i++) {
      let p = this.borderPoints[i];
      let actualR = p.absolute ? p.r: rFactor * p.r;
      let x = actualR * cos(p.theta);
      let y = actualR * sin(p.theta);
      points.push(new Point(x + this.centerX, y + this.centerY));
    }

    return points;
  }

  draw(rFactor) {
    push();
    translate(this.centerX, this.centerY);

    if (rFactor < 1.0/3) {
      textSize(14);
      fill(255);
      text(this.name, 0, 0);
      noFill();
    }

    noFill();
    strokeWeight(3);

    for (let i = 0; i < this.borderPoints.length; i++) {
      let p = this.borderPoints[i];
      let actualR = p.absolute ? p.r : rFactor * p.r;
      let x = actualR * cos(p.theta);
      let y = actualR * sin(p.theta);

      if (!p.absolute && checkCollision(new Point(x + this.centerX, y + this.centerY), rFactor, this.name)) {
      // if (actualR > 100) {
        p.r = actualR;
        p.absolute = true;
      }

      // linearGradientStroke(0, 0, x, y, this.c1, this.c2);
      // line(0, 0, x, y)
      stroke(this.c1.c());
      ellipse(x, y, 3, 3);
    }

    pop();
  }
}

function checkCollision(point, rFactor, ignoredShape) {
  for (let s = 0; s < shapes.length; s++) {
    let shape = shapes[s];
    if (shape.name == ignoredShape) {
      continue;
    }

    let points = shape.getAbsolutePoints(rFactor);
    for (let p = 0; p < points.length; p++) {
      let otherPoint = points[p];
      if (point.distance(otherPoint) < MIN_DIST) {
        console.log("FOUND COLLISION", point, otherPoint, shape.name, ignoredShape);
        return true;
      }
    }
  }

  return false;
}

function setup() {
  createCanvas(700, 700);
  background(0);
  // noLoop();

  colorSet = new ColorSet(3, 100);

  // noStroke();

  centerX = width/2;
  centerY = height/2;

  // shapes.push(new RadialShape(random() * centerX, random() * centerY));
  // shapes.push(new RadialShape(random() * centerX + centerX, random() * centerY));
  // shapes.push(new RadialShape(random() * centerX + centerX, random() * centerY + centerY));
  // shapes.push(new RadialShape(random() * centerX, random() * centerY + centerY));

  shapes.push(new RadialShape("top left", centerX/2, centerY/2));
  shapes.push(new RadialShape("top right", centerX/2 + centerX, centerY/2));
  shapes.push(new RadialShape("bottom right", centerX/2 + centerX, centerY/2 + centerY));
  shapes.push(new RadialShape("bottom left", centerX/2, centerY/2 + centerY));

  r = 25;
}

function draw() {
  for (let s = 0; s < shapes.length; s++) {
    let shape = shapes[s];
    shape.draw(r/startR);
  }

  r++;

  if (r > 500) {
    noLoop();
  }
}

function keyTyped() {
  if (key === 's') {
    saveCanvas('flower_collision_' + colorSet.toHash(), 'png')
  }

  if (key === 'l') {
    LOOPING = !LOOPING;
    if (LOOPING) {
      loop();
    } else {
      noLoop();
    }
  }
}