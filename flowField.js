let cont;
let field;
let pause = false;
let font;

function preload() {
    font = loadFont('assets/VCR_OSD_MONO.ttf');
  }
  
function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    // background(15);
    frameRate(30);
    colorMode(RGB);
    cont = new Container([0 - width/10,0 + height/5,0], 300);
    field = new Field(cont, 15);
    field.setup();
    console.log(cont.getCenter());
}   

function draw(){
    if(pause){
        noLoop();
    }else{loop()};
    background(15);
    stroke('white');
    point(mouseX - width/2, mouseY - height/2, 10);

    orbitControl();

    cont.draw();
    // translate(0,0,50);
    scale(6);
    field.calculatePoints();
    field.drawField();

}
function keyPressed(){
    //space bar to pause/unpause
    if(keyCode === 32){
        pause = !pause;
        draw();
    }
}

//draws a cube at position [x,y,z] with sides of length sideLength.
class Container{
    constructor(position, sideLength){
        //position = [x,y,z] 
        this.position = position;
        this.length = sideLength;
    }
    //return center of box
    getCenter(){
        let x = this.position[0];
        let y = this.position[1];
        let z = this.position[2];
        let center = [x + length/2, y - length/2, z + length/2];
        return center;
    }

    inCont(point){
        let x = this.position[0];
        let y = this.position[1];
        let z = this.position[2];
        let length = this.length;
        //*7 to account for scaling in draw method
        if(point[0] * 6 > x + length|| point[0] * 6 <= x){
            return false;
        }else
        if(point[1] * 6 > y || point[1] * 6 < y - length){
            return false;
        }else
        if(point[2] * 6 > z + length || point[2] * 6 < z){
            return false;
        }else{
            return true;
        }
    }

    draw(){
        let length = this.length;
        let x = this.position[0];
        let y = this.position[1];
        let z = this.position[2];
        // stroke('blue');
        // point(x + length/2, y - length/2, z + length/2);

        stroke('red');
        point(x,y,z);
        point(x + length, y, z);
        noFill();
        stroke('white');
        beginShape();
        vertex(x, y, z);
        vertex(x + length, y, z);
        vertex(x + length, y, z + length);
        vertex(x, y, z + length);
        vertex(x,y,z);
        vertex(x, y - length, z);
        vertex(x + length, y - length, z);
        vertex(x + length, y - length, z + length);
        vertex(x, y - length, z + length);
        vertex(x, y - length, z);
        endShape()
        beginShape()
        vertex(x + length, y, z);
        vertex(x + length, y - length, z);
        endShape();
        beginShape();
        vertex(x, y, z + length);
        vertex(x, y - length, z + length)
        endShape();
        beginShape();
        vertex(x + length, y, z + length);
        vertex(x + length, y - length, z + length);
        endShape();
    }
}

//takes a container in which to draw the flow field, and an integer to denote the amount of lines to draw
class Field{
    constructor(container, amount){
        this.container = container;
        this.amount = amount
        this.lineList = new Array();
        this.counter = 0;
    }
    setup(){
        let dx = 0.1
        for(let i = 0; i < this.amount; i++){
            this.lineList.push(new Line(250, [[dx,0,0]], this.container));
            dx += 0.1;
        }
    }
    calculatePoints(){
        //console.log(this.counter);
        let mode = 'l';

        if(this.counter < 300){
            mode = 'l';
        }
        if(this.counter >=300){
            mode = 'r';
        }if(this.counter >= 600){
            mode = 'cl';
        }if(this.counter >= 700){
            this.counter = 0;
        }
        for(const line of this.lineList){
            line.move(mode);
        }
        this.counter++;
    }
    drawField(){
        stroke('red');
        for(const l of this.lineList){
            for(let i = 1; i < l.points.length; i++){
                if(this.container.inCont(l.points[i -1]) && this.container.inCont(l.points[i -1]) && this.container.inCont(l.points[i]) && this.container.inCont(l.points[i])){
                    line(l.points[i-1][0],l.points[i-1][1],l.points[i-1][2], l.points[i][0],l.points[i][1],l.points[i][2]);
                }
            }
        }
    }
}

//takes an integer to denote the max. line length and an array of points([[x,y,z],[x2,y2,z2],[x3,y3,z3]])
class Line{
    constructor(length, points, cont){
        this.length = length;
        this.points = points;
        this.cont = cont;
    }
    move(mode){
        //lorenz attractor
        if(mode == 'l'){
            let a = 10;
            let b = 28;
            let c = 8.0/3.0;
            let dt = 0.01;

            let x = this.points[this.points.length - 1][0];
            let y = this.points[this.points.length - 1][1];
            let z = this.points[this.points.length - 1][2];

            let dx = a * (y - x);
            let dy = x * (b - z) - y;
            let dz = x * y - c * z;

            let p = [(x + dx * dt), (y + dy* dt), (z + dz* dt)];
            this.points.push(p);

            if(this.points.length > this.length){
                this.points.shift();
            }
          }else if(mode == 'r'){
            let a = 0.2;
            let b = 0.2;
            let c = 5.7;
            let dt = 0.01;
            let x = this.points[this.points.length - 1][0];
            let y = this.points[this.points.length - 1][1];
            let z = this.points[this.points.length - 1][2];

            let dx = -y - z;
            let dy = x + a * y;
            let dz = b + z * (x - c);

            let p = [(x + dx * dt), (y + dy* dt), (z + dz* dt)];
            this.points.push(p);
            if(this.points.length > this.length){
                this.points.shift();
            }
          }else if(mode == 'cl'){
              let a = 5;
              let b = -10;
              let c = -0.38;

              let dt = 0.001;
              let x = this.points[this.points.length - 1][0];
              let y = this.points[this.points.length - 1][1];
              let z = this.points[this.points.length - 1][2];
            
              let dx = a * x - y * z;
              let dy = b * y + x * z;
              let dz = c * z + x * (y/3);
              let p = [(x + dx * dt), (y + dy* dt), (z + dz* dt)];

              this.points.push(p);
              if(this.points.length > this.length){
                  this.points.shift();
              }
          }
    }
}