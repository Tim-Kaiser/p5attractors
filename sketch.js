let mousePositions = Array([20,20]);
let counter;
let lastMousePosX = 20;
let lastMousePosY = 20;
let font;

let showText = 1;
let showCursor = 1;
let attractorMode = 1;
let backgroundCol = 0;

let attractor;
//TODO: new class for display function; dot, line, and structure variants

function preload() {
  font = loadFont('assets/VCR_OSD_MONO.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(backgroundCol);
  frameRate(60);
  colorMode(RGB);


  if(attractorMode == 1){
    attractor = new LorenzAttractor(10, 0.01);
  }else if(attractorMode == 2){
    attractor = new RoesslerAttractor(30, 0.01);
  }else if(attractorMode == 3){
    attractor = new AizawaAttractor(10, 0.01);
  }else if(attractorMode == 4){
    attractor = new ChenLeeAttractor(15, 0.01);
  }
  if(attractorMode != 0){
    attractor.setup();
  }

  counter = 0; 
}

function draw() {

  if(showText == 1){
    //stroke('white');
    fill('white');
    textFont(font);
    textSize(15);
    text('c to show/hide cursor',-800,-200);
    text('t to show/hide help text', -800, -185);
    text('1-4 to cycle through attractors', -800, -170);
  }

  //need this for correct tracking in WEBGL space
  //IDK fix mouse tracker, larger ellipse needs to lag behind small circle, but catch up if theres no mouse movement
  noStroke();

  fill(backgroundCol);
  ellipse(mousePositions[mousePositions.length -1][0],mousePositions[mousePositions.length -1][1], 20, 20);

  if(showCursor == 1){
    let mpX = mouseX - width/2;
    let mpY = mouseY - height/2;

    lastMousePosX = mpX;
    lastMousePosY = mpY;

    fill(255, 255, 255, 100);
    ellipse(lastMousePosX, lastMousePosY, 20, 20);

    mousePositions.push([mpX,mpY]);
    fill('white');
    ellipse(mpX, mpY, 4, 4);
  }
  if(attractor instanceof AizawaAttractor){
    //position the attractor correctly in 3D space
    rotateX(radians(90));
    rotateY(radians(45));
    translate(200,-400);

    scale(400);
    attractor.move();
    attractor.display();
  }else if(attractor instanceof LorenzAttractor){
    scale(10);
    attractor.move();
    attractor.display();
    // console.log(attractor.pointList[0].x);
  }else if(attractor instanceof RoesslerAttractor){
    translate(-100,0);
    rotateY(radians(45));
    rotateX(radians(20));
    scale(50);
    attractor.move();
    attractor.display();
  }else if(attractor instanceof ChenLeeAttractor){
    rotateX(45);
    scale(25);
    attractor.move();
    attractor.display();
  }
  // counter++;
}
function hideText(){
  noStroke();
  fill(backgroundCol);
  rect(-80, -26, 30, 10);
}

function keyPressed(){
  //c
    
  if (keyCode === 67){
    showCursor *= -1;
  }
  if(keyCode === 84){
    showText *= -1;
    hideText();
  }
  //1
  if(keyCode === 49){
    attractorMode = 1;
    setup();
  }else if(keyCode === 50){
    attractorMode = 2;
    setup();
  }else if(keyCode === 51){
    attractorMode = 3;
    setup();
  }else if(keyCode === 52){
    attractorMode = 4;
    setup();
  }


}


class ChenLeeAttractor{
  constructor(points, xIncr){
    this.pointList = new Array();
    this.points = points;
    this.increment = xIncr;
  }
  setup(){
    let xPos = 0.1
    for(let i = 0; i < this.points; i++){
      //5, -10, -0.38
      let pt = new Point(xPos,0,4.5, 5, -10, -0.38, null, null, null);
      this.pointList.push(pt);
      xPos += this.increment;
    }
  }

  move(){
    for(const point of this.pointList){
      point.move('chenlee');
    }
  }
  display(){
    for(const point of this.pointList){
      point.display();
    }
  }

}

class AizawaAttractor{
  constructor(points, xIncr){
    this.pointList = new Array();
    this.points = points;
    this.increment = xIncr;
  }
  setup(){
    let xPos = 0.1
    for(let i = 0; i < this.points; i++){
      let pt = new Point(xPos,0,0, 0.95, 0.7, 0.6, 3.5, 0.25, 0.1);
      this.pointList.push(pt);
      xPos += this.increment;
    }
  }

  move(){
    for(const point of this.pointList){
      point.move('aizawa');
    }
  }
  display(){
    for(const point of this.pointList){
      point.display();
    }
  }
}


class RoesslerAttractor{
  constructor(points, xIncr){
    this.points = points;
    this.increment = xIncr;
    this.pointList = new Array();
  }

  setup(){
    let xPos = 0.1;
    for(let i = 0; i < this.points; i++){
      let pt = new Point(xPos, 0, 0, 0.2, 0.2, 5.7, null, null, null);
      this.pointList.push(pt);
      xPos += this.increment;
    }
  }

  move(){
    for(const point of this.pointList){
      point.move('roessler');
    }
  }

  display(){
    for(const point of this.pointList){
      point.display();
    }
  }
}

class LorenzAttractor{
  constructor(points, xIncr){
    this.points = points;
    this.pointList = new Array();
    this.increment = xIncr;

  }

  setup(){
    let xPos = 0.1;
    for(let i = 0; i < this.points; i++){
      let pt = new Point(xPos, 0, 0, 10, 28, 8.0/3.0, null, null, null);
      this.pointList.push(pt);
      xPos += this.increment;

    }
  }

  move(){
    for(const point of this.pointList){
      point.move('lorenz');
    }
  }

  display(){
    for(const point of this.pointList){
      point.display();

    }
  }
}

//constructs a single point for a chaos attractor
class Point {
    constructor(x,y,z, a,b,c,d,e,f){
        this.x = x;
        this.y = y;
        this.z = z;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;

        this.col = color(random()*255, random()*255, random()*255);
        //this.col = color(random()*255, random()*50, random()*50);

    }

    move(mode){
      //moving according to the lorenz attractor calculations
      if(mode == 'lorenz'){
          let a = this.a;
          let b = this.b;
          let c = this.c;
      
          let dt = 0.01;
          let dx = (a * (this.y - this.x)) * dt;
          let dy = (this.x * (b - this.z) - this.y) * dt;
          let dz = (this.x * this.y - c * this.z) * dt;

          this.x = this.x + dx;
          this.y = this.y + dy;
          this.z = this.z + dz;
      //moving according to the roessler attractor calculations
      }else if(mode == 'roessler'){
        let a = this.a;
        let b = this.b;
        let c = this.c;
    
        let dt = 0.01;
        let dx = (- this.y - this.z) * dt;
        let dy = (this.x + a * this.y) * dt;
        let dz = (b + this.z * (this.x - c)) * dt;
        
        this.x = this.x + dx;
        this.y = this.y + dy;
        this.z = this.z + dz;
      }else if(mode == 'aizawa'){
        let a = this.a;
        let b = this.b;
        let c = this.c;
        let d = this.d;
        let e = this.e;
        let f = this.f;

        let x = this.x;
        let y = this.y;
        let z = this.z;

        let dx = (z-b)*x - d*y;
        let dy = d*x + (z-b)*y;
        let dz = c + a*z - z*z*z/3 - (x*x + y*y)*(1 + e*z) + f*z*x*x*x;
    
        let dt = 0.01;        
        this.x = (this.x + dx * dt);
        this.y = (this.y + dy * dt);
        this.z = (this.z + dz * dt);
      }else if(mode == 'chenlee'){
        let a = this.a; //5
        let b = this.b; //-10
        let c = this.c; //-0.38

        let x = this.x;
        let y = this.y;
        let z = this.z;

        let dt = 0.004;

        let dx = a * x - y * z;
        let dy = b * y + x * z;
        let dz = c * z + x * (y/3);

        this.x = this.x + dx * dt;
        this.y = this.y + dy * dt;
        this.z = this.z + dz * dt;
      }
    }

    display(){
        stroke(this.col);
        point(this.x, this.y, this.z);
    }
}
