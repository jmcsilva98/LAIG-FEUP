/**
 * LinearAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class LinearAnimation extends Animation{
  constructor(scene, animationId, animationTime, controlPoints) {

  super(scene, animationId, animationTime);
  this.controlPoints = controlPoints;
  this.totalDistance;
  this.movementDistance = [];

  this.calculateDistance();

  this.velocity = this.totalDistance / this.animationTime;


  }

  calculateDistance(){

    for(var i = 0; i < controlPoints.length - 1; i++){

      var distance = Math.sqrt(Math.pow(this.controlPoints[i+1][0] - this.controlPoints[i][0],2) + Math.pow(this.controlPoints[i+1][1] - this.controlPoints[i][1],2) + Math.pow(this.controlPoints[i+1][2] - this.controlPoints[i][2],2));
      this.movementDistance.push(distance);
      this.totalDistance += distance;

    }

  };

  calculateAngle(initialPoint, finalPoint){

    var angle = Math.atan2(finalPoint[2] - initialPoint[2], finalPoint[0] - initialPoint[0]);
    if(finalPoint[2]-initialPoint[2] < 0){
      angle += Math.PI;
    }


    return angle;
  };

  update(){





  };




};
