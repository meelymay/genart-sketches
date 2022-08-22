class GradOrb {
  constructor(x, y, c1, c2, size) {
    this.x = x;
    this.y = y;
    this.c1 = c1;
    this.c2 = c2;
    this.size = size;
  }

  draw() {  
    push();
    noStroke();
    translate(this.x, this.y);
    rotate(random(2*PI));

    let rad = this.size;
    let ogRad = rad;
    let even = true;
    for (let theta = 0; theta < 2*PI; theta += 0.03) {
      let x = ogRad * cos(theta);
      let y = ogRad * sin(theta);

      linearGradientFill(x, y, 0-x, 0-y, this.c1, this.c2);
      ellipse(0, 0, rad, rad);

      rad -= this.size/100;
      if (rad < 0) {
        break;
      }
    }
    pop();
  }
}