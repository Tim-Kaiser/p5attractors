let x;
let y;
let z;
let dt;

let a;
let b;
let c;
let d;
let e;
let f;

let prevX;
let prevY;
let prevZ;

let ptList;
let pt;
function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    // background(150);
    frameRate(30);
    colorMode(HSL);
    prevX = 0.1;
    prevY = 0;
    prevZ = 0;
    x = 0.1;
    y = 0;
    z = 0;
    dt = 0.01;
    a = 0.95;
    b = 0.7;
    c = 0.6;
    d = 3.5;
    e = 0.25;
    f = 0.1;
    let dx = 0.1;
    ptList = new Array();
    for(let i = 0; i < 15; i++){
        pt = new Pt(x + dx,y,z);
        pt.setup();
        ptList.push(pt);
        dx = dx + 0.1;
    }
}

function draw(){
    background(15);
    rotateX(radians(90));
    rotateY(radians(45));
    translate(200,-400);

    scale(400);
    for(const pt of ptList){
        pt.move();
        pt.draw();
    }
}

class Pt{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.points = new Array();
        this.col1 = color(52, 100, 44, 1);
        this.col2 = color(25, 100, 36, 0.7);
        this.col3 = color(53, 100, 72);
        this.col4 = color(39, 100, 33, 0.8);
    }
    setup(){
        this.points.push([this.x, this.y, this.z]);
    }

    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    getZ(){
        return this.z;
    }
    move(){
        let dx = (this.z-b)*this.x - d*this.y;
        let dy = d*this.x + (this.z-b)*this.y;
        let dz = c + a*this.z - this.z*this.z*this.z/3 - (this.x*this.x + this.y*this.y)*(1 + e*this.z) + f*this.z*this.x*this.x*this.x;
        
        this.x = (this.x + dx * dt);
        this.y = (this.y + dy * dt);
        this.z = (this.z + dz * dt);
        this.points.push([this.x, this.y, this.z]);
        if(this.points.length > 250){
            this.points.shift();
        }
    }
    draw(){
        strokeWeight(2);
        for(let i = 1; i < this.points.length; i++){
            stroke(this.col1);
            if(this.points[i][1] > 1){
                stroke(this.col3);
            }else if(this.points[i][1] < -0.1){
                stroke(this.col2);
            }else if(this.points[i][1] > -0.1 && this.points[i][1] < 0.2){
                stroke(this.col4);
            }
            line(this.points[i-1][0],this.points[i-1][1],this.points[i-1][2], this.points[i][0],this.points[i][1],this.points[i][2]);
            //point(this.points[i].x,this.points[i].y,this.points[i].z);
        }
    }
    setColor(col){
        this.col = col;
    }

}