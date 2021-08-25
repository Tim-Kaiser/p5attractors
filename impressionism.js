let img;
let d;
let pixelArray = [];
function preload(){
    img = loadImage("assets/stillleben.jpg");
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    background(150);
    image(img, 0,0, width, height);
    loadPixels();
    d = pixelDensity();
    pixelArray = pixels.slice(0);
    console.log(pixelArray);
}

function draw(){
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    const i = 4 * d*(y * d*width + x);
    const [r,g,b] = [pixelArray[i], pixelArray[i+ 1], pixelArray[i + 2]];
    let dx = x + (Math.random() * 15 + 3);
    let dy = y + (Math.random() * 15 + 3);
    strokeWeight(4);
    stroke(color(r,g,b));
    line(x,y,dx,dy);
}

