class Player extends CGFobject {
  constructor(scene, playerId) {
    super(scene);
    this.playerId = playerId;

    this.minutes = "00";
    this.seconds = "00";

    this.score = 0;
    this.addTime = true;


    this.setPlayer();

  }

  setPlayer() {
    if (this.playerId == 1) {
      this.color = "white";
      this.playerPos = vec3.fromValues(0, 35, 5);
    } else {
      this.color = "black";
      this.playerPos = vec3.fromValues(0, 35, -5);
    }

  }

  incrementScore() {
    this.score = this.score + 2;
  }

  beginCounter() {
    this.addTime = true;
    if (this.scene.game.gameLevel == 1)
      this.totalTimeSeconds = 30;
    else if (this.scene.game.gameLevel == 2)
      this.totalTimeSeconds = 15;
    this.timeCicle = setInterval(
      function() {
        this.totalTimeSeconds--;
        this.getTime();
      }.bind(this),
      1000
    );

  }

  convertTime(time) {
    let numberString = time + "";
    if (numberString.length >= 2) return numberString;
    else return "0" + numberString;
  }

  getTime() {
    this.minutes = this.convertTime(parseInt(this.totalTimeSeconds / 60));
    this.seconds = this.convertTime(this.totalTimeSeconds % 60);

    if (this.minutes == "00" && this.seconds == "00") {
      this.scene.game.currentState = this.scene.game.state.TIMER_UP;
      this.scene.game.checkState();
    }

  }

  restartTime() {
    this.minutes = "00";
    this.seconds = "00";
  }

  stopCounter() {
    clearInterval(this.timeCicle);
  }
}
