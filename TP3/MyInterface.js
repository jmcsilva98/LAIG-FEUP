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

        this.scenes = this.gui.addFolder("Scenes Available");
        this.scenes.open();
        this.gui.scene = 'relaxing';
        this.gui.sceneList = this.scenes.add(this.gui,'scene', ['relaxing', 'classic']).name('Current Scene');
        this.gui.sceneList.onFinishChange(function(){
            this.removeFolder("Lights",this.gui);
            this.removeFolder("Views",this.gui);
            this.removeFolder("Options",this.gui);
            this.removeFolder("Game Settings",this.gui);
            this.removeFolder("Menu",this.gui);
            this.scene.onChangeGraph(this.gui.scene + '.xml');	}.bind(this))

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

    addGameModeGroup(game){
        var group = this.gui.addFolder("Game Settings");
        group.open();
        group.add(this.scene, "gameMode", ["Player vs Player", "Player vs Bot", "Bot vs Bot"]).name("Game Mode");
        group.add(this.scene, "gameDifficulty", ["Rookie", "Pro"]).name('Game Difficulty');
        let aux =  group.add(this.scene, "gameSwitchView").name('Switch View');

      aux.onChange(game.setGameView());

    }

    addMenuGroup(){

      var group = this.gui.addFolder("Menu");
      group.open();

      group.add(this.scene, 'startGame').name('Start Game');
      group.add(this.scene, 'quitGame').name('Quit Game');
      group.add(this.scene, 'undo').name('Undo');
      group.add(this.scene, 'movie').name('Movie');
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

    removeFolder(name, parent){
      if(!parent)
		    parent = this.gui;
      let folder = parent.__folders[name];
      if (!folder) {
      return;
      }
    folder.close();
    parent.__ul.removeChild(folder.domElement.parentNode);
    delete parent.__folders[name];
    parent.onResize();
    }

}
