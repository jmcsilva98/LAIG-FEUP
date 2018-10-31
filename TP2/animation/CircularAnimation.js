/**
 * CircularAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class CircularAnimation extends Animation{
  constructor(scene, animationId, animationTime, center, radius, initialAngle, rotAngle) {

  super(scene, animationId, animationTime);
  this.center = center;
  this.radius = radius;
  this.initialAngle = initialAngle * Math.PI/180;
  this.rotAngle = rotAngle* Math.PI/180;

  }

  calculateAnimation(currentTime){

  var identMatrix = mat4.create();
  if(this.currentTime < 0)
  {
    this.currentTime = currentTime;
    return identMatrix;
  }

  //calculates the time passed in seconds (time given in milliseconds)
  var deltaTime = (currentTime - this.currentTime)/1000;

  if(this.animationTime < deltaTime)
    deltaTime = this.animationTime;

  var deltaAngle = this.initialAngle + this.rotAngle / this.animationTime * deltaTime;

  mat4.translate(identMatrix,identMatrix, this.center);
  mat4.rotate(identMatrix,identMatrix,deltaAngle,[0,1,0]);
  mat4.translate(identMatrix,identMatrix, [this.radius,0,0]);


  return identMatrix;
  };


};
