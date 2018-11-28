/**
 * LinearAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class LinearAnimation extends Animation{
  constructor(scene, animationId, animationTime, controlPoints) {

  super(scene, animationId, animationTime);
  this.controlPoints = controlPoints;
  this.movementDistance = [];
  this.distanceBetween2Points=0;
  this.initialPoint=0;
  this.direction =vec3.create(); // direção do movimento atual
  vec3.sub(this.direction,this.controlPoints[1],this.controlPoints[0]);

  this.currentPosition=vec3.create(); //vetor para guardar a posição atual
  this.currentSegmentLength = vec3.length(this.direction); //comprimento do segmento atual
  this.angle = 0;
  this.totalDistance=0;
  this.actualIndex=1;
  this.matrix=mat4.create();
  this.currentTime=0;
  this.endOfAnimation=false;



  this.calculateDistance();
  this.calculateAngle(this.controlPoints[1],this.controlPoints[0]);

  this.velocity = this.totalDistance / this.animationTime;
  }

  calculateDistance(){
    var distance=vec3.create();
    for(var i = 0; i < this.controlPoints.length - 1; i++){
      vec3.sub(distance,this.controlPoints[i+1],this.controlPoints[i]);
      this.movementDistance.push(vec3.length(distance));
      this.totalDistance += vec3.length(distance);
    }
  };

  calculateAngle(initialPoint, finalPoint){

    this.angle = Math.atan(finalPoint[2] - initialPoint[2],finalPoint[0]-initialPoint[0]);
  };

  updateIndex(){

      this.actualIndex++;
      if (this.actualIndex == this.controlPoints.length){

        this.endOfAnimation=true;
        this.actualIndex-=1;

      }
      else{
      vec3.sub(this.direction,this.controlPoints[this.actualIndex],this.controlPoints[this.actualIndex-1]);
      this.currentSegmentLength = vec3.length(this.direction);
      this.calculateAngle(this.controlPoints[this.actualIndex-1],this.controlPoints[this.actualIndex]);
      }
  }
  calculateMatrix(currentTime){
    var deltaTime = currentTime - this.currentTime;
    var distance = deltaTime * this.velocity;
    this.distanceBetween2Points+=distance;

    if (this.distanceBetween2Points> this.currentSegmentLength){
      this.distanceBetween2Points-=this.currentSegmentLength;
      this.updateIndex();
    }
    this.currentTime = currentTime;


  }
  update(currentTime){
    if ((!this.endOfAnimation)){
      this.calculateMatrix(currentTime);
    }

  }

apply(){
  
  if (this.endOfAnimation){
    return this.matrix;
 }

var identMatrix=mat4.create();
var scaleFactor =this.distanceBetween2Points / this.currentSegmentLength; // calcula o factor pelo qual a posição inicial tem que ser multiplicada para obter a nova
                                                                          // é sempre calculado a partir da posição inicial                  
                                                                          // consoante o tempo que passa, calcula-se a percentagem que foi percorrida
vec3.scale(this.currentPosition,this.direction,scaleFactor);
mat4.translate(identMatrix,identMatrix,this.controlPoints[this.actualIndex-1]);
mat4.translate(identMatrix,identMatrix,this.currentPosition);
mat4.rotate(identMatrix,identMatrix,Math.PI/2 - this.angle,[0,1,0]);
this.matrix=identMatrix;
return identMatrix;

}
}
