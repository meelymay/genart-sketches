function randomInt(min, max) {
  if (!max) { 
    max = min
    min = 0
  }

  let r = max - min
  return min + Math.floor(Math.random() * r);
}

function randn_bm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  return num
}

function randomGaussian(mean, minVal) {
  let gauss01 = randn_bm();
  return lerp(minVal, mean + (mean - minVal), gauss01);
}

function bitsToHash(traitNum, bits) {
  let s = '';

  for (let i = 0; i < traitNum; i++) {
    let hex = parseInt(bits.slice(i*8, i*8+8), 2).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    s += hex
  }

  return s;
}

class Point {
  constructor(x, y) { 
    this.x = x;
    this.y = y;
  }
}