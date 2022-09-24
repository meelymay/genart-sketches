class ColorSet {
  constructor(n, variance) {
    this.background = Color.genGreyish();
    this.colors = []
    this.variance = variance || 0;
    for (let i = 0; i < n; i++) {
      let red = Math.random()*255;
      let green = Math.random()*255;
      let blue = Math.random()*255;

      let color = new Color(red, green, blue);

      if (color.brightness() < 50) {
        i -= 1;
        continue;
      }

      this.colors.push(color);
    }
  }

  chooseColor() {
    if (this.colors.length == 0) {
      return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }

    if (this.colors.length == 2) {
      let color = this.colors[Math.floor(random() * 2)];
      return new Color(
        randomGaussian(color.r, this.variance),
        randomGaussian(color.g, this.variance),
        randomGaussian(color.b, this.variance)
      );
    }

    let whichColor = Math.random();
    let colorIndex = 0;
    if (whichColor < .4) {
      colorIndex = 1;
    }
    if (whichColor < .1) {
      colorIndex = 2;
    }
    let color = this.colors[colorIndex];
    return new Color(
      randomGaussian(color.r, this.variance),
      randomGaussian(color.g, this.variance),
      randomGaussian(color.b, this.variance)
    );
  }

  toHash() {
    let c1 = this.colors[0];
    return 'r' + Math.floor(c1.r) + 'g' + Math.floor(c1.g) + 'b' + Math.floor(c1.b);
  }
}

class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  c() {
    return color(this.r, this.g, this.b);
  }

  static genGreyish() {
    let bgColor;
    while (!bgColor || bgColor.brightness() > 50 || bgColor.lightness() < 600) {
      bgColor = new Color(
        random() * 255,
        random() * 255,
        random() * 255,
      );
    }
    return bgColor;
  }

  genOpposing() {
    return new Color(
      randomGaussian(255 - this.r, 25) % 255,
      randomGaussian(255 - this.g, 25) % 255,
      randomGaussian(255 - this.b, 25) % 255
    );
  }

  brightness() {
    return abs(this.r - this.g) + abs(this.r - this.b) + abs(this.g - this.b);
  }

  lightness() {
    return this.r + this.g + this.b;
  }
}

function setColors(n) {
  let colors = [];

  let primaryRed = randomInt(0, 255);
  let primaryGreen = randomInt(0, 255);
  let primaryBlue = randomInt(0, 255);

  let secondaryRed = randomInt(0, 255);
  let secondaryGreen = randomInt(0, 255);
  let secondaryBlue = randomInt(0, 255);

  colors.push(new Color(primaryRed, primaryGreen, primaryBlue));
  colors.push(new Color(secondaryRed, secondaryGreen, secondaryBlue))

  let spread = 120;
  let halfSpread = spread/2;
  for (let i = 0; i < (n/3 + 1); i ++) {
    colors.push(new Color(
      primaryRed + randomInt(0, spread)-halfSpread,
      primaryGreen + randomInt(0, spread)-halfSpread,
      primaryBlue + randomInt(0, spread)-halfSpread
    ))
    colors.push(new Color(
      primaryRed + randomInt(0, spread)-halfSpread,
      primaryGreen + randomInt(0, spread)-halfSpread,
      primaryBlue + randomInt(0, spread)-halfSpread
    ))
    colors.push(new Color(
      secondaryRed + randomInt(0, spread)-halfSpread,
      secondaryGreen + randomInt(0, spread)-halfSpread,
      secondaryBlue + randomInt(0, spread)-halfSpread
    ))
  }

  return colors;
}

function linearGradientFill(x1, y1, x2, y2, color1, color2) {
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, color1.c());
  gradient.addColorStop(1, color2.c());
  ctx.fillStyle = gradient;
}

function linearGradientStroke(x1, y1, x2, y2, color1, color2) {
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, color1.c());
  gradient.addColorStop(1, color2.c());
  ctx.strokeStyle = gradient;
}