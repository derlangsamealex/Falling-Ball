let a = 0;
function SvgElement(str,obj) {
  let output=document.createElementNS("http://www.w3.org/2000/svg",str);
  for(prop in obj) {
    output.setAttribute(prop, obj[prop]);
  }
  return output;
}
function svgChgProp(target,obj) {
  for(prop in obj) {
    target.setAttribute(prop, obj[prop]);
  }
}
function calcDirection(dx,dy) {
  if(dx == 0 && dy == 0) {
    return 0;
  }
  if(dx >= 0 && dy >= 0) {
    return Math.PI - Math.atan(Math.abs(dx / dy));
  }
  if(dx >= 0 && dy < 0) {
    return Math.atan(Math.abs(dx / dy));
  }
  if(dx < 0 && dy < 0) {
    return 2 * Math.PI - Math.atan(Math.abs(dx / dy));
  }
  if(dx < 0 && dy >= 0) {
    return Math.PI + Math.atan(Math.abs(dx / dy));
  }
}        
World=function() {
  this.g = 0.04;
  this.t1 = 0;
  this.t2 = 0;
  this.t3 = 0;
  this.touchedTime = 0;
  this.width = innerWidth;
  this.height = innerHeight;
  this.line = [];
  let x1, x2, y1, y2; 
  this.surface = document.createElement("div");
  this.surface.style.position = "absolute";
  this.surface.style.left = 0;
  this.surface.style.top = 0;
  this.surface.style.width = this.width + "px";
  this.surface.style.height = this.height + "px";
  this.surface.style.overflow = "hidden"; 
  document.body.appendChild(this.surface); 
  this.svg = new SvgElement("svg",{
    left: 0,
    top: 0,
    width: 36000,
    height: 50800
  });
  this.surface.appendChild(this.svg);
  this.rect = new SvgElement("rect",{
    left: 0,
    top: 0,
    width: 36000,
    height: 50800,
    fill: "url(#Gradient2)"
  })
  this.svg.appendChild(this.rect);
  this.ball = new Ball(18000,50);
  this.surface.scrollLeft = 17820;
  this.svg.appendChild(this.ball.circle);
  this.handleEvent = function() {
    switch(event.type) {
      case "touchstart":
        x1 = event.touches[0].clientX+this.surface.scrollLeft;
        y1 = event.touches[0].clientY+this.surface.scrollTop;
      break;
      case "touchmove":  
        x2 = event.touches[0].clientX + this.surface.scrollLeft;
        y2 = event.touches[0].clientY + this.surface.scrollTop;    
        this.line.push(new Line(x1, y1, x2, y2));
        this.svg.appendChild(this.line[this.line.length - 1].line); 
        x1 = event.touches[0].clientX + this.surface.scrollLeft;
        y1 = event.touches[0].clientY + this.surface.scrollTop;
    }
  }
   this.svg.addEventListener("touchstart",this);
  this.svg.addEventListener("touchmove",this);
  this.start = function() {
    this.t1 = setInterval(this.running.bind(this), 20);
    
  }
  this.running = function() {
    this.ball.falling = true;
    let i = 0;
    a++;
    while (!(this.touchedTime >= 1 || !this.line[i])) {
      let line = this.line[i];
      let j = 0;
      while (!(this.touchedTime >= 1 || !line.tp[j])) {
        if(Math.sqrt((line.tp[j][0]-this.ball.x)**2+(line.tp[j][1]-this.ball.y)**2)<=this.ball.r) {    
          this.touchedTime = 1;
          console.log(line.direction/Math.PI*180+":"+this.ball.direction/Math.PI*180+": "+a);
          if(line.direction - this.ball.direction >= -Math.PI && line.direction - this.ball.direction <= 0) {
            this.ball.direction = 2 * Math.PI * (2 * line.direction - this.ball.direction) % (2 * Math.PI);
           // console.log("under: "+a);
          }
          else {
            this.ball.direction =  (2 * Math.PI + (2 * line.direction - this.ball.direction)) % (2 * Math.PI);
            //console.log(this.ball.direction/Math.PI*180 + ": " + a)
          }
        }
        j++;
      }
      i++;
    }
    if(this.touchedTime == 1) {
      console.log(this.touchedTime)
      this.ball.vx = this.ball.v * Math.sin(-this.ball.direction) * 0.9;  
      this.ball.vy = this.ball.v * Math.cos(this.ball.direction) * 0.9;    
    }
    if(this.touchedTime >= 1) {
      
      this.touchedTime++;  
    }
    if(this.touchedTime == 5) {
      this.touchedTime = 0;  
    }
    this.ball.vy += this.g;
    if(this.ball.y>=50800) {
      clearInterval(this.t1);
      isRunning=false;
      this.ball.vx=0;
      this.ball.vy=0;
      this.ball.x=18000;
      this.ball.y=50;
    }
    this.ball.move();   
    this.surface.scrollLeft = this.ball.x - this.width/2;
    this.surface.scrollTop=this.ball.y-this.height/2;
  }
}
Line=function(x1,y1,x2,y2) {
  let x, y;
  this.tp=[]; //touchpoint
  this.circle=[];
  this.line=new SvgElement("line",{
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    stroke: "white"
  });  
  this.dx=x1-x2;
  this.dy=y1-y2;
  let steps=Math.ceil(Math.abs((this.dx ** 2 + this.dy ** 2) ** 0.5) / 5);
  this.direction = calcDirection(this.dx, this.dy);
  this.direction >= Math.PI ? this.direction -= Math.PI : null;
  if(steps > 0) {
    for(let i = 0; i <= steps; i++) {
      this.tp[i]=[x1 - (x1 - x2) * i / steps, y1 - (y1 - y2) * i / steps];
    }
  }
}
Ball=function(x, y) {
  this.gradient=document.getElementById("Gradient1");
  this.falling = true;
  this.rotation = 0;
  this.vy = 0;
  this.vx = 0;
  this.direction = 0;
  this.v = 0;
  this.x = x;
  this.y = y;
  this.r = 15;
  this.circle = new SvgElement("circle",{
    cx: x,
    cy: y,
    r: 15,
    fill: "url(#Gradient1)"
  });
  this.move=function() { 
    this.x+=this.vx;   
    this.y+=this.vy; 
    this.v=Math.sqrt(this.vx**2+this.vy**2);
    svgChgProp(this.circle,{
      cx: this.x,
      cy: this.y
    });    
    this.rotation += this.vx;
    svgChgProp(this.circle, {
      transform: `rotate(${this.rotation} ${this.x} ${this.y})`    
    });
  }
  this.handleEvent=function() {
    switch(event.type) {
      case "touchstart":
        !isRunning?start():this.vy-=4;
      break;
    }
  }
  this.circle.addEventListener("touchstart",this);
}