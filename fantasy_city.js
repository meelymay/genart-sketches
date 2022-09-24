let buildings = [];
let numBuilds = 18;
let colorSet;

let colorVariance = 25;
let minWidth = 15;
let minHeight = 30;

class Building {
  constructor(x, w, h) {
    this.x = x;
    this.w = w;
    this.h = h;
    this.color = colorSet.chooseColor();
  }

  draw() {
    fill(this.color.r, this.color.g, this.color.b);
    rect(this.x - this.w/2, height*0.8 - this.h, this.w, this.h);
  }
}

function setup() {
  createCanvas(800, 800);
  pixelDensity(5);
  noStroke();

  colorSet = new ColorSet(3, colorVariance);
  
  let bgColor;
  while (!bgColor || bgColor.brightness() > 50 || bgColor.lightness() < 600) {
    bgColor = new Color(
      random() * 255,
      random() * 255,
      random() * 255,
    );
  }
  background(bgColor.r, bgColor.g, bgColor.b);

  for (let b = 0; b < numBuilds/4; b++) {
    let x = randomGaussian(width/2, width/6);
    let w = randomGaussian(30, 15);
    let h = max(0, randomGaussian(height/2.5 - abs(width/2 - x) * 0.5, 80));
    
    if (w < minWidth || h < minHeight) {
      b -= 1;
      continue;
    }

    build = new Building(x, w, h);
    buildings.push(build);
    build.draw();
  }

  for (let b = 0; b < numBuilds; b++) {
    let xRange = width - 200;
    let x = width/2 + random() * xRange - xRange/2;
    let w = randomGaussian(30, 15);
    let h = max(0, randomGaussian(height/3 - abs(width/2 - x) * 0.8, 80));
    
    if (w < minWidth || h < minHeight) {
      b -= 1;
      continue;
    }

    build = new Building(x, w, h);
    buildings.push(build);
    build.draw();
  }
  
  noLoop();
}

function draw() {
  
}

function keyTyped() {
  if (key === 's') {
    saveCanvas('fantasy_city_' + colorSet.toHash(), 'png')
  }
}