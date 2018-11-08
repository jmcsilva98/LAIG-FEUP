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
  this.matrix=mat4.create();
  this.currentTime=0;

  }

  calculateAnimation(currentTime){
  var identMatrix = mat4.create();
  if(this.currentTime <= 0)
  {
    this.currentTime = currentTime;
    return identMatrix;
  }

  //calculates the time passed in seconds (time given in milliseconds)
  var deltaTime = (currentTime - this.currentTime);
  if(this.animationTime < deltaTime)
    deltaTime = this.animationTime; 

  var deltaAngle = this.initialAngle + this.rotAngle / this.animationTime * deltaTime;
  mat4.translate(identMatrix,identMatrix, this.center);
  mat4.rotate(identMatrix,identMatrix,deltaAngle,[0,1,0]);
  mat4.translate(identMatrix,identMatrix, [this.radius,0,0]);
  if (this.rotang > 0) mat4.rotate(matrix, matrix, Math.PI, [0, 1, 0]);
  this.currentTime+=currentTime;
  return identMatrix;
  };

  updateMatrix(deltaTime){

    if (this.currentTime<this.animationTime)
      this.matrix=this.calculateAnimation(deltaTime);
      return this.matrix;
     
  }
};
