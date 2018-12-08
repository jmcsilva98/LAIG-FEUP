class Player extends CGFObject{
  constructor(scene, playerId){
    super(scene);
    this.playerId=playerId;
  }

  setPlayer(){

    if (this.playerId==1) this.color="white";
    else    this.color="black";
  }


}