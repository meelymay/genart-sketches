let h = 750;
let w = h;
let angle = 1/3.0;
let columns = [];
let square;
let subdivideLikelihood = 0.5;
let colors;

class Column {
  constructor(x, y, size, height, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.height = height/2.0;
    this.color = color;
  }

  draw() {
    push();
    ambientMaterial(this.color.r, this.color.g, this.color.b);
    // console.log("translate", this.x, this.y);
    translate(this.x, this.y, 0+this.height/2.0);
    box(this.size, this.size, this.height);
    pop();
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
        likeDecay = 0.7;
      }
      let newLike = likelihood * likeDecay;
      this.children.push(new SubdividedSquare(x + newTrans, y + newTrans, newSize, newLike))
      this.children.push(new SubdividedSquare(x + newTrans, y - newTrans, newSize, newLike))
      this.children.push(new SubdividedSquare(x - newTrans, y + newTrans, newSize, newLike))
      this.children.push(new SubdividedSquare(x - newTrans, y - newTrans, newSize, newLike))
    } else {
      this.column = new Column(x, y, size, random() * size*5, colors.chooseColor())
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
  createCanvas(h, w, WEBGL);
  noLoop();
  ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 1000);
  // ortho();
  angleMode(DEGREES);

  colors = new ColorSet(3, 18);
  
  noStroke();

  // for (let i = 0; i < 25; i++) {
  //   let x = Math.floor(random()*w) - w/2.0;  // /100.0) * 100;
  //   let y = Math.floor(random()*h) - h/2.0;  // /100.0) * 100*angle + 300;
  //   let size = random()*35 + 30
  //   let height = random()*150 + 50;
  //   // let c1 = random()*200 + 55;
  //   let color = new Color( //c1, c1, c1);
  //     random()*255,
  //     random()*255,
  //     random()*255,
  //   );
  //   let c = new Column(x, y, size, height, color);
  //   columns.push(c)
  // }
  square = new SubdividedSquare(0, 0, h - 100, 1.0)
}

function draw() {
  background(0);

  rotateX(-15);
  rotateZ(-25);

  // Lights
  pointLight(255, 255, 255, -w, 0, h*2.0);
  ambientLight(150, 150, 150);

  // push();
  // ambientMaterial(255, 255, 255);
  // translate(200, 200, 0);
  // box(20, 20, 80);
  // pop();

  // for (let i = 0; i < columns.length; i++) {
  //   console.log(columns[i]);
  //   columns[i].draw();
  // }
  square.draw();
}