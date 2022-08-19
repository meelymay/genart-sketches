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

    noStroke();

    let x = this.x;
    let y = this.y - this.height;
    let size = this.size;
    let height = this.height;
    let color = this.color;
    let gradient = .66;

    fill(color.r, color.g, color.b);
    beginShape();
    vertex(x, y);
    vertex(x+size, y-size*angle);
    vertex(x, y-2*size*angle);
    vertex(x-size, y-size*angle);
    vertex(x, y);
    endShape();
    
    fill(color.r*gradient, color.g*gradient, color.b*gradient);
    beginShape();
    vertex(x, y);
    vertex(x, y+height);
    vertex(x+size, y+height-size*angle);
    vertex(x+size, y-size*angle);
    vertex(x, y);
    endShape();
    
    fill(color.r*gradient*gradient, color.g*gradient*gradient, color.b*gradient*gradient);
    beginShape();
    vertex(x, y);
    vertex(x, y+height);
    vertex(x-size, y+height-size*angle);
    vertex(x-size, y-size*angle);
    vertex(x, y);
    endShape();

    pop();
  }
}

function setup() {
  createCanvas(w, h);
  noLoop();

  for (let i = 0; i < 25; i++) {
    let xCoord = Math.floor(random()*w/100.0);
    let yCoord = Math.floor(random()*h/100.0);

    let x = Math.floor(random()*w/100.0) * 100;
    let y = Math.floor(random()*h/100.0) * 100*angle + 300;
    let size = random()*35 + 30
    let height = random()*150 + 50;
    let c1 = random()*200 + 55;
    let color = new Color(c1, c1, c1);
    //   random()*255,
    //   random()*255,
    //   random()*255,
    // );
    let c = new Column(x, y, size, height, color);
    columns.push(c)
  }

  columns.sort((a, b) => a.y > b.y ? 1 : -1)
}

function draw() {
  background(0);

  for (let i = 0; i < columns.length; i++) {
    columns[i].draw();
  }
}