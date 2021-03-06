/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        //this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][1];
                group.add(this.scene.lightValues, key);
            }
        }
    }


    /**
     * Adds a folder containing the IDs of the views passed as parameter.
     * @param {array} Views
     */
    addViewsGroup(views) {

        var group = this.gui.addFolder("Views");
        group.open();
        var view = [];

       for(var key in views){
          if(views.hasOwnProperty(key)){
            view.push(key);

          }
        }
        let scene= this.scene;
        group.add(this.scene, "index", view).onChange(function(index){


         scene.camera=views[index];
        });
    }
    addAxisGroup(){
        var group=this.gui.addFolder("Options");
		group.open();
        group.add(this.scene, 'axisOn');
    }
    processKeyboard (event) {
        // call CGFinterface default code (omit if you want to override)
        CGFinterface.prototype.processKeyboard.call(this,event);

      switch (event.keyCode) {
        case 109://m
          this.scene.switchMaterials();
        break;
        case 77://M
          this.scene.switchMaterials();
        break;

      }

    }

}
