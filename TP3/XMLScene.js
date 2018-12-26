var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
  /**
   * @constructor
   * @param {MyInterface} myinterface
   */
  constructor(myinterface) {
    super();

    this.interface = myinterface;
    this.lightValues = {};
    this.index;
    this.axisOn = true;
    this.isReady=0;
    this.gameMode = "Player vs Player";
    this.gameDifficulty = "Rookie";
    this.gameSwitchView = true;
  }

  /**
   * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
   * @param {CGFApplication} application
   */
  init(application) {
    super.init(application);

    this.sceneInited = false;


    this.initCameras();

    this.enableTextures(true);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis = new CGFaxis(this);
    this.view = [];
    this.client = new Client();
    this.client.getPrologRequest("handshake");
    this.game= new Clobber(this);
    this.game.getInitialBoard();


    this.setPickEnabled(true);

  }

  /**
   * Initializes the scene cameras.
   */
  initCameras() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));


  }
  /**
   * Initializes the scene lights with the values read from the XML file.
   */
  initLights() {
    var i = 0;
    // Lights index.

    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
      if (i >= 8)
        break; // Only eight lights allowed by WebGL.

      if (this.graph.lights.hasOwnProperty(key)) {
        var light = this.graph.lights[key];

        //lights are predefined in cgfscene
        if (light[0] == "omni") {
          this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
          this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
          this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
          this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
        } else if (light[0] == "spot") {
          this.lights[i].setSpotCutOff(light[2]);
          this.lights[i].setSpotExponent(light[3]);
          this.lights[i].setPosition(light[4][0], light[4][1], light[4][2], light[4][3]);
          this.lights[i].setSpotDirection(light[5][0], light[5][1], light[5][2]);
          this.lights[i].setAmbient(light[6][0], light[6][1], light[6][2], light[6][3]);
          this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[7][3]);
          this.lights[i].setSpecular(light[8][0], light[8][1], light[8][2], light[8][3]);
        }

        this.lights[i].setVisible(true);

        i++;
      }
    }
  }


  /* Handler called when the graph is finally loaded.
   * As loading is asynchronous, this may be called already after the application has started the run loop
   */
  onGraphLoaded() {
    // this.camera.near = this.graph.near;
    //  this.camera.far = this.graph.far;

    //TODO: Change reference length according to parsed graph
    this.axis = new CGFaxis(this, this.graph.referenceLength);

    // TODO: Change ambient and background details according to parsed graph
    this.setGlobalAmbientLight(this.graph.ambientIlumination[0], this.graph.ambientIlumination[1],
      this.graph.ambientIlumination[2], this.graph.ambientIlumination[3]);
    this.gl.clearColor(this.graph.backgroundIlumination[0], this.graph.backgroundIlumination[1],
      this.graph.backgroundIlumination[2], this.graph.backgroundIlumination[3]);


    this.initLights();
    this.initCameras();
    // Adds lights group.
    this.interface.addLightsGroup(this.graph.lights);

    //Adds views group.
    this.index = this.graph.defaultView;
    this.interface.addViewsGroup(this.graph.views);
    this.interface.addAxisGroup();
    this.interface.addGameModeGroup();
    this.interface.addMenuGroup();
    this.camera = this.graph.views[this.graph.defaultView];


    this.sceneInited = true;
  }

  switchMaterials() {

    for (var key in this.graph.components) {
      var component = this.graph.components[key];

      if (component.materialId != "inherit" && component.materialsList.length != 0) {
        if (component.nextMaterialId == component.materialsList.length - 1)
          component.nextMaterialId = 0;
        else component.nextMaterialId++;

        component.materialId = component.materialsList[component.nextMaterialId];
      }

    }

  }

  logPicking(){
let column,row;
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
          var id = this.pickResults[i][1]-1;
          column= id % 8;
          row = Math.floor(id / 8);
          //console.log("Picked object: " + obj + ", with ROW " + row + " AND COLUMN "+column);
          if (this.game.gameMode==1 || (this.game.gameMode==2 && this.game.player==1)){
          
          this.game.selectedPiece(row,column,obj);
          }
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
  }


  //MENU FUNCTIONS

  startGame(){

      if(this.gameMode == "Player vs Player"){
        this.gameDifficulty = "Rookie";
      }
      console.log("Game Mode: " + this.gameMode);
      console.log("Game Difficulty: " + this.gameDifficulty);
      this.game.startGame(this.gameMode,this.gameDifficulty);
    }

  quitGame(){
    //CHAMAR QUIT GAME

  }
  undo(){
    //CHAMAR UNDO

  }
  movie(){
    //CHAMAR MOVIE
  }

  /**
   * Displays the scene.
   */
  display() {
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.logPicking();
    this.clearPickRegistration();


    if(typeof this.game != "undefined"){
      if(this.game.player == 1){
        document.getElementById("player").innerText = "Player: White";
        document.getElementById("timer").innerText = "Time Passed\n"+ this.game.whitePlayer.minutes + ":" + this.game.whitePlayer.seconds + "\n\n";
        document.getElementById("score").innerText = "Score: " + this.game.whitePlayer.score + "\n";
      }
      else if(this.game.player == 2){
        document.getElementById("player").innerText = "Player: Black";
        document.getElementById("timer").innerText = "Time Passed\n"+ this.game.blackPlayer.minutes + ":" + this.game.blackPlayer.seconds + "\n\n";
        document.getElementById("score").innerText = "Score: " + this.game.blackPlayer.score + "\n";
      }

      document.getElementById("info").innerText = this.info + "\n";
      document.getElementById("error").innerText = this.error;


    }
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();

    if (this.sceneInited) {
      // Draw axis
      if (this.axisOn)
        this.axis.display();

      //ADICIONAR FUNCAO PARA MUDAR A CAMARA
      if(this.gameSwitchView){

      }

      var i = 0;
      for (var key in this.lightValues) {
        if (this.lightValues.hasOwnProperty(key)) {
          if (this.lightValues[key]) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
          } else {
            this.lights[i].setVisible(false);
            this.lights[i].disable();
          }
          this.lights[i].update();
          i++;
        }
      }


      // Displays the scene (MySceneGraph function).
      this.graph.displayScene();
      this.interface.setActiveCamera(this.camera);
    } else {
      // Draw axis
      this.axis.display();
    }

    this.popMatrix();
    // ---- END Background, camera and axis setup
  }
}
