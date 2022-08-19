let h = 500;
let w = h;
let angle = 1/3.0;
let columns = [];

class Column {
  constructor(x, y, size, height, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.height = height;
    this.color = color;
  }

  draw() {
    push();
    ambientMaterial(this.color.r, this.color.g, this.color.b);
    console.log("translate", this.x, this.y);
    translate(this.x, this.y, 0+this.height/2.0);
    box(this.size, this.size, this.height);

    // ambientMaterial(255, 255, 255);
    // translate(200, 200, 0);
    // box(20, 20, 80);
    pop();
  }
}

function setup() {
  createCanvas(h, w, WEBGL);
  noLoop();
  ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 1000);
  // ortho();
  angleMode(DEGREES);
  
  noStroke();

  for (let i = 0; i < 25; i++) {
    let x = Math.floor(random()*w) - w/2.0;  // /100.0) * 100;
    let y = Math.floor(random()*h) - h/2.0;  // /100.0) * 100*angle + 300;
    let size = random()*35 + 30
    let height = random()*150 + 50;
    // let c1 = random()*200 + 55;
    let color = new Color( //c1, c1, c1);
      random()*255,
      random()*255,
      random()*255,
    );
    let c = new Column(x, y, size, height, color);
    columns.push(c)
  }
}

function draw() {
  background(0);

  rotateX(-60);
  rotateZ(-45);

  // Lights
  pointLight(255, 255, 255, 20, 50, 400);
  ambientLight(150, 150, 150);

  push();
  ambientMaterial(255, 255, 255);
  translate(200, 200, 0);
  box(20, 20, 80);
  pop();

  for (let i = 0; i < columns.length; i++) {
    console.log(columns[i]);
    columns[i].draw();
  }

  translate(0,0,300);
}