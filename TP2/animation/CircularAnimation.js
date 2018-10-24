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
  this.initialAngle = initialAngle;
  this.rotAngle = rotAngle;



  }




};
