let t1, world, isRunning=false;
onload=function(){
  alert("draw a line and bounce the ball");
  alert("tap ball to start and tap again to kick the ball");
  t1 = setTimeout(init,500);
}
function init() {
  world = new World();
}
function start() {
  if(!isRunning) {
    world.start();  
  }
  isRunning=true;
}