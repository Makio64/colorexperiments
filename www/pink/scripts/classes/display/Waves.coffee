define [
    'TweenMax'
    'jquery',
  ], 
  (TweenMax, $) ->
    class Waves extends PIXI.Graphics

      _w : null
      _h : null

      globalTick: null
      points: null
      pointCount: null
      pointSpeed: null
      spacing: null

      verticalPointRange: null
      randomRange: null
      iPath: null
      iPoints: null

      constructor: ->
      @_w = window.innerWidth,
      @_h = window.innerHeight
      globalTick = 0
      points = []
      pointCount = 12
      pointSpeed = 6
      spacing = canvasWidth / pointCount
      pointCount = pointCount + 2   
      verticalPointRange = 60



  


      randomRange: (min, max) ->
        Math.floor( (Math.random() * (max - min + 1) ) + min)

      var Point = function(x, y, alt){
        this.x = x;  
        this.y = y;
        this.yStart = y;
        this.alt = alt;  
      }


      update: (dt) ->
        range = 


    
Point.prototype.update = function(i){
  var range = (this.alt) ? verticalPointRange : -verticalPointRange;
  this.x += pointSpeed;
  this.y = (this.yStart) + Math.sin(globalTick/14) * -range;
  
  if(this.x > (canvasWidth + spacing)){
    this.x = -spacing;
    var moved = points.splice(i, 1);
    points.unshift(moved[0]);
  }
}
     
var updatePoints = function(){
  var i = points.length;
  while(i--){
    points[i].update(i);         
  }
}
              
for(iPoints = 0; iPoints < pointCount; iPoints++){
  var alt = (iPoints % 2 === 0);
  var offset = (alt) ? verticalPointRange : -verticalPointRange;
  points.push(new Point(spacing * (iPoints-1), canvasHeight/2, alt));  
}

var renderPath = function(){
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for(iPath = 1; iPath < pointCount; iPath++){
    context.lineTo(points[iPath].x, points[iPath].y);
  }
  context.stroke();  
}
    
var clear = function(){
  context.fillStyle = 'hsla(0, 0%, 100%, .15)';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}
                
var loop = function(){
  window.requestAnimFrame(loop, canvas);
  clear();
  updatePoints();
  renderPath();
  globalTick++;
};

loop();