let img;

function preload(){
    img = loadImage("assets/tokyo.png");
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    background(0);
    image(img, 0,0, width, height);
}

function draw(){
    for(let x = 0; x < width; x++){
        for(let y = 0; y < height; y++){
            let n = noise(x,y);
            strokeWeight(random() * 0.7);
            if(n > 0.7){
                let c = color(n * 255);
                c.setAlpha(n * 255);
                stroke(c);
                point(x,y);
            }
        }
    }
    console.log("done");
    noLoop();
}