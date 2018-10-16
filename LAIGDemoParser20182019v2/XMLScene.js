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
        this.index = "view1";
        this.oldIndex = this.index;
        this.i=0;
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

    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.orthoCamera= new CGFcameraOrtho(-100, 100, -5, 5, 0.1, 500, vec3.fromValues(30,5,2), vec3.fromValues(0,0,0),1);


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
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                if (light[0]=="omni"){
                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
                }
                else if (light[0]=="spot"){
                    this.lights[i].setSpotCutOff(light[2]);
                    this.lights[i].setSpotExponent(light[3]);
                    this.lights[i].setPosition(light[4][0], light[4][1], light[4][2], light[4][3]);
                    this.lights[i].setSpotDirection(light[5][0],light[5][1],light[5][2]);
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
        this.axis = new CGFaxis(this,this.graph.referenceLength);

        // TODO: Change ambient and background details according to parsed graph
        this.setGlobalAmbientLight(this.graph.ambientIlumination[0],this.graph.ambientIlumination[1],
                                    this.graph.ambientIlumination[2],this.graph.ambientIlumination[3]);
        this.gl.clearColor(this.graph.backgroundIlumination[0],this.graph.backgroundIlumination[1],
            this.graph.backgroundIlumination[2],this.graph.backgroundIlumination[3]);


        this.initLights();
        this.initCameras();
        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        //Adds views group.
        this.interface.addViewsGroup(this.graph.newView);
        this.interface.setActiveCamera(this.graph.newView[0]);

        this.sceneInited = true;
    }

    switchMaterials(){

      for(var key in this.graph.components){
        var component = this.graph.components[key];

        if(component.materialId != "inherit" && component.materialsList.length != 0){
          if(component.nextMaterialId == component.materialsList.length_t - 1)
            component.nextMaterialId = 0;
          else component.nextMaterialId++;

          component.materialId = component.materialsList[component.nextMaterialId];
        }

      }

    }
    changingToNextCamera(){
        console.log(this.i);
        if (this.i == this.graph.newView.length - 1) {
            this.i = 0;
        } else this.i++;

        //this.camera = this.graph.newView[this.i];
        if (this.graph.newView[this.i][0]=="perspective"){
        this.camera.fov = this.graph.newView[this.i][1];
        this.camera.near = this.graph.newView[this.i][2];
        this.camera.far = this.graph.newView[this.i][3];
        this.camera.setPosition(this.graph.newView[this.i][4]);
        this.camera.setTarget(this.graph.newView[this.i][5]);
        }
        else if (this.graph.newView[this.i][0]=="ortho"){
            console.log("ortho");
            this.orthoCamera.left = this.graph.newView[this.i][1];
             this.orthoCamera.right = this.graph.newView[this.i][2];
            this.orthoCamera.bottom = this.graph.newView[this.i][3];
            this.orthoCamera.top = this.graph.newView[this.i][4];
            this.orthoCamera.near = this.graph.newView[this.i][5];
            this.orthoCamera.far = this.graph.newView[this.i][6];
            this.orthoCamera.setPosition(this.graph.newView[this.i][7]);
           this.orthoCamera.setTarget(this.graph.newView[this.i][8]);
            this.orthoCamera.setUp(this.graph.newView[this.i][9]);
            this.interface.setActiveCamera(this.orthoCamera);
            }

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

      // Apply transformations corresponding to the camera position relative to the origin
      this.applyViewMatrix();

      this.pushMatrix();

      if (this.sceneInited) {
          // Draw axis
          this.axis.display();

          var i = 0;
          for (var key in this.lightValues) {
              if (this.lightValues.hasOwnProperty(key)) {
                  if (this.lightValues[key]) {
                      this.lights[i].setVisible(true);
                      this.lights[i].enable();
                  }
                  else {
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
      }
      else {
          // Draw axis
          this.axis.display();
      }

      this.popMatrix();
      // ---- END Background, camera and axis setup
  }
}
