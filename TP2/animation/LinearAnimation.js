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
  this.direction =vec3.create(); // direção do movimento atual
  vec3.sub(this.direction,this.controlPoints[1],this.controlPoints[0]); 

  this.currentPosition=vec3.create(); //vetor para guardar a posição atual
  this.currentSegmentLength = vec3.length(this.direction); //comprimento do segmento atual

  this.totalDistance=0;
  this.actualIndex=0;
  this.matrix=mat4.create();
  this.currentTime=0;
  this.endOfAnimation=false;


  this.calculateDistance();

  this.velocity = this.totalDistance / this.animationTime;
  }

  calculateDistance(){
    for(var i = 0; i < this.controlPoints.length - 1; i++){
      var distance=vec3.create();
      vec3.sub(distance,this.controlPoints[i+1],this.controlPoints[i]);
      this.movementDistance.push(vec3.length(distance));
      this.totalDistance += vec3.length(distance);
    }
  };

  calculateAngle(initialPoint, finalPoint){

    var angle = Math.atan2(finalPoint[2] - initialPoint[2], finalPoint[0] - initialPoint[0]);
    if(finalPoint[2]-initialPoint[2] < 0){
      angle += Math.PI;
    }



    return angle;
  };
  
  updateIndex(){
      console.log("updateIndex");
      this.actualIndex++;
      if (this.actualIndex == this.controlPoints.length){
        this.endOfAnimation=true;
        this.actualIndex=0;
      
      vec3.sub(this.direction,this.controlPoints[this.actualIndex+1],this.controlPoints[this.actualIndex]);
      this.currentSegmentLength = vec3.length(this.direction);
      }
  }
  calculateMatrix(currentTime){
    var identMatrix=mat4.create();
    if (this.currentTime <= 0){
    this.currentTime=currentTime;
    return identMatrix;
    }

    var distance = currentTime * this.velocity;
    this.distanceBetween2Points+=distance;
    
    if (this.distanceBetween2Points> this.currentSegmentLength){
      this.distanceBetween2Points-=this.currentSegmentLength;
      this.updateIndex();
    }
    var scaleFactor =this.distanceBetween2Points / this.currentSegmentLength; // calcula o factor pelo qual a posição inicial tem que ser multiplicada para obter a nova
                                                                              // é sempre calculado a partir da posição inicial
                                                                              // consoante o tempo que passa, calcula-se a percentagem que foi percorrida                                                                       
    vec3.scale(this.currentPosition,this.direction,scaleFactor);
    mat4.translate(this.matrix,this.matrix,this.controlPoints[this.actualIndex]);
    mat4.translate(identMatrix,identMatrix,this.currentPosition);
    this.currentTime+=currentTime;
    return identMatrix;
  

  }
  updateMatrix(currentTime){
    if ((this.currentTime < this.animationTime)){
      this.matrix = this.calculateMatrix(currentTime);
    }
    return this.matrix;
  }

apply(){
  this.scene.pushMatrix();
  this.scene.translate(this.controlPoints[this.actualIndex][0],this.controlPoints[this.actualIndex][1],this.controlPoints[this.actualIndex][2]);
  this.scene.translate(this.currentPosition[0],this.currentPosition[1],this.currentPosition[2]);
  this.scene.popMatrix();
}
}
