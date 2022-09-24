let ctx;
let colorSet;
let c1, c2, c3, c4;

function setup() {
  createCanvas(600, 600);
  noStroke();

  colorSet = new ColorSet(3);

  ctx = canvas.getContext('2d');
  
  c1 = new Color(
    random()*255,
    random()*255,
    random()*255
  );  
  c2 = c1.genOpposing();
  
  noLoop();
}

function draw() {
  background(colorSet.background.c());
  
  let rad = width/1.5;
  let ogRad = rad;
  for (let theta = 0; theta < 2*PI; theta += 0.005) {
    let x = rad * cos(theta);
    let y = rad * sin(theta);

    linearGradientFill(x, y, width-x, height-y, c1, c2);
    ellipse(width/2, height/2, rad, rad);
    rad -= width/300;
    
    if (rad < 0) {
      break;
    }
  } 
}

function keyTyped() {
  if (key === 's') {
    saveCanvas('grad_ellipse_' + colorSet.toHash(), 'png')
  }
}