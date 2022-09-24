let centerX;
let centerY;

let theta = 0;
let startR = 100;
let r = startR;
let dr = 0;

let colorSet;

let shape;

class RadialShape {
  constructor(x, y) {
    this.centerX = x;
    this.centerY = y;
    this.borderPoints = [];

    let theta = 0;
    let startR = 100;
    let r = startR;

    while (theta < 2 * PI) {
      let x = r * cos(theta);
      let y = r * sin(theta);

      this.borderPoints.push(new Point(x, y));
      
      theta += 0.01;
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

  draw() {
    push();
    translate(this.centerX, this.centerY);

    for (let i = 0; i < this.borderPoints.length; i++) {
      let p = this.borderPoints[i];

      ellipse(p.x, p.y, 5, 5);
    }

    pop();
  }
}

function setup() {
  createCanvas(400, 400);
  background(0);
  noLoop();

  colorSet = new ColorSet();

  fill(colorSet.chooseColor().c());
  noStroke();  

  centerX = width/2;
  centerY = height/2;

  shape = new RadialShape(centerX, centerY);
}

function draw() {
  shape.draw();
}

function keyTyped() {
  if (key === 's') {
    saveCanvas('fantasy_city_' + colorSet.toHash(), 'png')
  }
}