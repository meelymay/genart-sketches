let PIXEL_DENS = 5;

let COLLISION_ON = true;
let GRADIENT_ON = true;
let CURVE_ON = true;
let NEUTRAL_BG = false;

let NUM_SHAPES = 10;
let MIN_DIST = 15;
let RADIUS_VELOCITY = 0.5;
let THETA_VELOCITY = 0.01;
let COLOR_RANGE = 25;
let GRADIENT_SPEED = 1.3;

let LOOPING = true;

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
    this.center = new Point(x, y);
    this.borderPoints = [];
    this.c1 = colorSet.chooseColor();
    this.c2 = colorSet.chooseColor();
    if (!GRADIENT_ON) {
      this.c2 = this.c1;
    }
    this.maxR = 0;

    let theta = 0;
    let startR = 100;
    let r = startR;

    while (theta < 2 * PI + 2 * THETA_VELOCITY) {
      // let x = r * cos(theta);
      // let y = r * sin(theta);

      this.borderPoints.push(new RadialPoint(r, theta));
      
      theta += THETA_VELOCITY;
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
      let actualR = p.absolute ? p.r : rFactor * p.r;
      let x = actualR * cos(p.theta);
      let y = actualR * sin(p.theta);
      points.push(new Point(x + this.center.x, y + this.center.y));
    }

    return points;
  }

  draw(rFactor) {
    push();
    translate(this.center.x, this.center.y);

    if (rFactor < 0) {
      textSize(14);
      fill(255);
      text(this.name, 0, 0);
    }

    noFill();
    let c = this.c1.lerp(this.c2, min(rFactor * GRADIENT_SPEED, 1));
    stroke(c.c());
    strokeWeight(3);

    if (CURVE_ON) {
      beginShape();
    }
    for (let i = 0; i < this.borderPoints.length; i++) {
      let p = this.borderPoints[i];

      // if (p.absolute) {
      //   continue;
      // }

      let actualR = p.absolute ? p.r : rFactor * p.r;
      if (actualR > this.maxR) {
        this.maxR = actualR;
      }

      let x = actualR * cos(p.theta);
      let y = actualR * sin(p.theta);

      if (COLLISION_ON && !p.absolute && checkCollision(new Point(x + this.center.x, y + this.center.y), rFactor, this.name)) {
        p.r = actualR;
        p.absolute = true;
      }

      // linearGradientStroke(0, 0, x, y, this.c1, this.c2);
      // line(0, 0, x, y)
      if (CURVE_ON) {
        curveVertex(x, y);
      } else {
        ellipse(x, y, 2, 2);
      }
    }
    if (CURVE_ON) {
      endShape();
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

    if (point.distance(shape.center) > shape.maxR + MIN_DIST) {
      continue;
    }

    let points = shape.getAbsolutePoints(rFactor);
    for (let p = 0; p < points.length; p++) {
      let otherPoint = points[p];
      if (point.distance(otherPoint) < MIN_DIST) {
        return true;
      }
    }
  }

  return false;
}

function setup() {
  createCanvas(500, 500);
  pixelDensity(PIXEL_DENS);
  // noLoop();

  colorSet = new ColorSet(3, COLOR_RANGE);
  if (NEUTRAL_BG) {
    background(222);
  } else {
    let bg = colorSet.chooseColor();
    background(bg.r/2, bg.g/2, bg.b/2);
  }

  // noStroke();

  centerX = width/2;
  centerY = height/2;

  // shapes.push(new RadialShape(random() * centerX, random() * centerY));
  // shapes.push(new RadialShape(random() * centerX + centerX, random() * centerY));
  // shapes.push(new RadialShape(random() * centerX + centerX, random() * centerY + centerY));
  // shapes.push(new RadialShape(random() * centerX, random() * centerY + centerY));

  // shapes.push(new RadialShape("top left", centerX/2, centerY/2));
  // shapes.push(new RadialShape("top right", centerX/2 + centerX, centerY/2));
  // shapes.push(new RadialShape("bottom right", centerX/2 + centerX, centerY/2 + centerY));
  // shapes.push(new RadialShape("bottom left", centerX/2, centerY/2 + centerY));

  for (let s = 0; s < NUM_SHAPES; s++) {
    let shape = new RadialShape("name_" + s, random() * width, random() * height);

    if (checkCollision(shape.center, 1.0/startR)) {
      continue;
    }

    shapes.push(shape);
  }

  r = 1;
}

function draw() {
  for (let s = 0; s < shapes.length; s++) {
    let shape = shapes[s];
    shape.draw(r/startR);
  }

  r += RADIUS_VELOCITY;

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