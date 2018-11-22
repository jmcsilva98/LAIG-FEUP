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
  this.endOfAnimation=false;

  }

  calculateAnimation(currentTime){

  if(this.currentTime <= 0)
  {
    this.currentTime = currentTime;
    return this.matrix;
  }

  //calculates the time passed in seconds (time given in milliseconds)
  var deltaTime = (currentTime - this.currentTime);
  if(this.animationTime < deltaTime)
    deltaTime = this.animationTime;



  this.deltaAngle = this.initialAngle + this.rotAngle / this.animationTime * this.currentTime;
  this.currentTime+=deltaTime;


  };

  update(deltaTime){

    if (this.currentTime<this.animationTime){
      this.calculateAnimation(deltaTime);

    }
  else {
    this.endOfAnimation=true;
  }
}

apply(){

  var identMatrix = mat4.create();
  if(this.currentTime <= 0)
  {
    return identMatrix;
  }
  mat4.translate(identMatrix,identMatrix, this.center);
  mat4.rotate(identMatrix,identMatrix,this.deltaAngle,[0,1,0]);
  mat4.translate(identMatrix,identMatrix, [this.radius,0,0]);
  if (this.rotAngle > 0) mat4.rotate(identMatrix, identMatrix, Math.PI, [0, 1, 0]);

    return identMatrix;

}
};