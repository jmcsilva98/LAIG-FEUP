class Player extends CGFobject{
  constructor(scene, playerId){
    super(scene);
    this.playerId=playerId;
    this.minutes = "00";
    this.seconds = "00";
    this.score = 0;
    this.addTime = true;
    this.totalMinutes = 0;
    this.totalSeconds = 0;

    this.setPlayer();

  }

  setPlayer(){
    //this.initial_camera_timestamp = performance.now();
    // if (this.playerId==1 && this.scene.gameSwitchView){
    //   // this.color="white";
    //    this.playerPos = vec3.fromValues(0, 35, 5);
    //    this.cameraMoving = true;
    //    this.camera_animation = new CircularAnimation( this.camera_center, this.camera_speed, this.camera_radius, 90, 180);
    //    console.log("Camera Animation -> " + this.camera_animation);
    // }
    // else if (this.scene.gameSwitchView){
    //   // this.color="black";
    //    this.playerPos =vec3.fromValues(0, 35, -5);
    //    this.cameraMoving = true;
    //    this.camera_animation = new CircularAnimation( this.camera_center, this.camera_speed, this.camera_radius, -90, 180);
    // }

    if (this.playerId==1 ){
      this.color="white";
      this.playerPos = vec3.fromValues(0, 35, 5);
    }else{
      this.color="black";
      this.playerPos =vec3.fromValues(0, 35, -5);
    }

  }

  incrementScore(){ this.score = this.score + 2;}

  beginCounter(){
    this.addTime = true;
    this.totalTimeSeconds = 0;
    this.timeCicle = setInterval(
    function() {
      this.totalTimeSeconds++;
      this.getTime();
    }.bind(this),
    1000
  );

  }


  convertTime(time){
    let numberString = time + "";
    if(numberString.length >= 2) return numberString;
    else return "0" + numberString;
  }

  //chama a funcao para converter o tempo em string e coloca o tempo nas variaveis
  getTime(){
    this.minutes = this.convertTime(parseInt(this.totalTimeSeconds / 60));
    this.seconds = this.convertTime(this.totalTimeSeconds % 60);

  }

  restartTime(){
    this.minutes ="00";
    this.seconds = "00";
  }

  stopCounter(){
    clearInterval(this.timeCicle);
  }
}
