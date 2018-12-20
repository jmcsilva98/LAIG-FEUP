class Player extends CGFobject{
  constructor(scene, playerId){
    super(scene);
    this.playerId=playerId;
    this.minutes = "00";
    this.seconds = "00";
    this.score = 0;

  }

  setPlayer(){

    if (this.playerId==1) this.color="white";
    else    this.color="black";
  }

  incrementScore(){ this.score++;}

  // beginCounter(){
  //   this.totalTimeSeconds = 0;
  //   this.timeCicle = setInterval(function(){
  //     this.totalTimeSeconds++;
  //     this.setTime();
  //   }.bind(this), 1000);
  //
  // }


}
