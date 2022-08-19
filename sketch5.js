let h = 1000;
let w = h;
let angle = 1/3.0;
let columns = [];
let square;
let subdivideLikelihood = 0.5;
let colors = new ColorSet(3, 18);

class Column {
  constructor(x, y, size, height, color, otherColor) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.height = height/2.0;
    this.color = color;
    this.otherColor = otherColor;
  }

  draw() {
    fill(this.color.r, this.color.g, this.color.b);
    stroke(this.color.r, this.color.g, this.color.b);
    rect(this.x, this.y, this.size, this.size);

    let rotations = Math.floor(random() * 4);
    let centShift = this.size/2.0 + 1;
    let arcCentX = this.x - centShift;
    let arcCentY = this.y - centShift;
    let arcStart = 0;
    let arcStop = PI/2;
    if (rotations > 1) {
      arcCentX = this.x + centShift;
      arcCentY = this.y - centShift;
      arcStart = PI/2;
      arcStop = PI;
    }
    if (rotations == 2) {
      arcCentX = this.x + centShift;
      arcCentY = this.y + centShift;
      arcStart = PI;
      arcStop = PI * 3/2.0;
    }
    if (rotations == 3) {
      arcCentX = this.x - centShift;
      arcCentY = this.y + centShift;
      arcStart = PI * 3/2.0;
      arcStop = 0;
    }

    // fill(this.otherColor.r, this.otherColor.g, this.otherColor.b);
    // stroke(this.otherColor.r, this.otherColor.g, this.otherColor.b);
    // arc(arcCentX, arcCentY, this.size*2 + 1, this.size*2 + 1, arcStart, arcStop);
  }
}

class SubdividedSquare {
  constructor(x, y, size, likelihood) {
    this.children = [];
    if (random() < likelihood) {
      let newSize = size/2.0;
      let newTrans = newSize/2.0;

      let likeDecay = 1.0;
      if (size < h/2.0) {
        likeDecay = 0.6;
      }
      let newLike = likelihood * likeDecay;
      this.children.push(new SubdividedSquare(x + newTrans, y + newTrans, newSize, newLike))
      this.children.push(new SubdividedSquare(x + newTrans, y - newTrans, newSize, newLike))
      this.children.push(new SubdividedSquare(x - newTrans, y + newTrans, newSize, newLike))
      this.children.push(new SubdividedSquare(x - newTrans, y - newTrans, newSize, newLike))
    } else {
      this.column = new Column(x, y, size, random() * size*5, colors.chooseColor(), colors.chooseColor())
    }
  }

  draw() {
    if (this.children.length > 0) {
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        child.draw();
      }
    } else {
      this.column.draw();
    }
  }
}

function setup() {
  createCanvas(h, w);
  noLoop();
  // angleMode(DEGREES);
  rectMode(CENTER);
  
  strokeWeight(1);

  square = new SubdividedSquare(w/2.0, h/2.0, h - 100, 1.0)
}

function draw() {
  background(0);
  square.draw();
}