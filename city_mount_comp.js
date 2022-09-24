let w = 1000;
let h = 700;

let colors;
let horizon = h * 0.6;
let bg;

function setup() {
	createCanvas(w, h);

	colors = new ColorSet(3, 20);

	let gradMountains = new GradMountains(0, w, horizon, 5);
	let bgIndex = gradMountains.squiggles.length - 1;
 	bg = gradMountains.squiggles[bgIndex].color;
	background(bg.c());
	gradMountains.draw();

	let moon = new GradOrb(
		random() * w * .6 + .2 * w,
		random() * h * .3 + .05 * h,
		colors.getLightest(),
		colors.getDarkest(),
		randomGaussian(h * .2, 50));
	moon.draw();

	let city = new City(horizon, 30, h);
	city.draw();

	noLoop();
}

function draw() {
	
}

function keyTyped() {
  if (key === 's') {
    saveCanvas('city_comp_' + colors.toHash(), 'png')
  }
}