var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX=6;
var PRIMITIVES_INDEX=7;
var COMPONENTS_INDEX=8;


/**
 * MySceneParser class, representing the scene graph.
 */
class MySceneParser {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];
        this.perspectives = []; //added by me



        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }
    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }
     /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }


        var error;

        // Processes each node, verifying errors.

        // <SCENE>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse INITIAL block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <VIEWS>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse VIEWS block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <AMBIENT>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse AMBIENT block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }


        // <LIGHTS>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse LIGHTS block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <TEXTURES>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse TEXTURES block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <MATERIALS>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }
         // <TRANSFORMATIONS>
         if ((index = nodeNames.indexOf("transformations")) == -1)
         return "tag <transformations> missing";
     else {
         if (index != TRANSFORMATIONS_INDEX)
             this.onXMLMinorError("tag <transformations> out of order");

         //Parse TRANSFORMATIONS block
         if ((error = this.parseTransformations(nodes[index])) != null)
             return error;
     }
         // <PRIMITIVES>
         if ((index = nodeNames.indexOf("primitives")) == -1)
         return "tag <primitives> missing";
     else {
         if (index != PRIMITIVES_INDEX)
             this.onXMLMinorError("tag <primitives> out of order");

         //Parse PRIMITIVES block
         if ((error = this.parsePrimitives(nodes[index])) != null)
             return error;
     }


            // <COMPONENTS>
            if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse COMPONENTS block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }

          return null;
    }

     parseScene(sceneNode){

        var rootName = sceneNode.getAttribute("root");
        if (rootName==null)
            this.onXMLMinorError("There's no scene name.");

        var axisLength = sceneNode.getAttribute("axis_length");
        if (axisLength==null){
           this.onXMLMinorError("There's no axis length; assuming value=10");
           this.referenceLength=1;
        }else{

            this.referenceLength = axisLength;
        }

        return null;

    }


    parseViews(viewsNode){
        var view = viewsNode.children;

        var defaultView= viewsNode.getAttribute("default");
        if(defaultView==null)
        this.onXMLMinorError("There's no views name.");

        var perspective = viewsNode.getElementsByTagName('perspective');
        if(perspective.length ==0){
          this.onXMLMinorError("There isn't any block perspective.");
        }

        for(var i  =0; i < view.length;i++)
        {
          var nodeName = view[i].nodeName;
          var perspectiveComponent = [];

          if(nodeName == "perspective"){
            var viewId = this.reader.getString(view[i], 'id');
            if(viewId == null)
              return "There's no perspective id";
              perspectiveComponent.push(viewId);

            var near = this.reader.getFloat(view[i], 'near');
            if(near == null)
                return "There's no near values"; //mudar
                perspectiveComponent.push(near);

            var far = this.reader.getFloat(view[i], 'far');
            if(far == null)
                return "There's no far values"; //mudar
                perspectiveComponent.push(far);

            var angle = this.reader.getFloat(view[i], 'angle');
            //testar o angle
            perspectiveComponent.push(angle);

            var perspectiveChildren = view[i].children;


            for(var j = 0; j < perspectiveChildren.length; j++){
              var nodeName = perspectiveChildren[j].nodeName;
                if(nodeName == "from"){
                  var xfrom = this.reader.getFloat(perspectiveChildren[j], 'x');
                  var yfrom = this.reader.getFloat(perspectiveChildren[j], 'y');
                  var zfrom = this.reader.getFloat(perspectiveChildren[j], 'z');
                }else if(nodeName == "to"){
                  var xto = this.reader.getFloat(perspectiveChildren[j], 'x');
                  var yto = this.reader.getFloat(perspectiveChildren[j], 'y');
                  var zto = this.reader.getFloat(perspectiveChildren[j], 'z');
                  }
              }

              this.newCamera = new CGFcamera(angle, near, far, vec3.fromValues(xfrom,yfrom,zfrom), vec3.fromValues(xto,yto,zto));
              this.perspectives.push(this.newCamera); //the new camera view is added to the array

          }else if(nodeName == "ortho"){
            //se for ortho
          }
          else{
            //testar se o nome nao e nenhumdos dois
          }
        }
            return null;
    }

    parseAmbient(ambientNode){
        var ambient = ambientNode.getElementsByTagName('ambient');
        if (ambient.length>1){
            return "no more than one initial ambient may be defined";
        }
        var background=ambientNode.getElementsByTagName('background');
        this.ambientIlumination=[0,1,0,0];
        this.backgroundIlumination=[0,0,1,0];

        if (background.length>1)
            return "no more than one initial background may be defined";
        var rAmbient = ambient[0].getAttribute('r');
        if (rAmbient==null || rAmbient <0 || rAmbient>1){
            this.graph.ambientIlumination[0]=this.ambientIlumination[0];
        }

        var gAmbient=ambient[0].getAttribute("g");
        if (gAmbient==null || gAmbient <0 || gAmbient>1){
            this.graph.ambientIlumination[1]=this.ambientIlumination[1];
        }
        var bAmbient=ambient[0].getAttribute("b");
        if (bAmbient==null || bAmbient <0 || bAmbient>1){
            this.graph.ambientIlumination[2]=this.ambientIlumination[2];
        }
        var aAmbient=ambient[0].getAttribute("a");
        if (aAmbient==null || aAmbient <0 || aAmbient>1){
            this.graph.ambientIlumination[3]=this.ambientIlumination[3];
        }
        var rBackground=background[0].getAttribute("r");

        if ( rBackground==null || rBackground <0 || rBackground>1){
            this.graph.backgroundIlumination[0]=this.backgroundIlumination[0];
        }
        var gBackground=background[0].getAttribute("g");
        if ( gBackground==null || gBackground <0 || gBackground>1){
            this.graph.backgroundIlumination[1]=this.backgroundIlumination[1];
        }
        var bBackground=background[0].getAttribute("b");
        if ( bBackground==null || bBackground <0 || bBackground>1){
            this.graph.backgroundIlumination[2]=this.backgroundIlumination[2];
        }
        var aBackground=background[0].getAttribute("a");
        if ( aBackground==null || aBackground <0 || aBackground>1){
            this.graph.backgroundIlumination[3]=this.backgroundIlumination[3];
        }

          return null;
    }
    parseLights(lightsNode){

      if(lightsNode.length == 0)
        this.onXMLMinorError("There isn't any light.");
      var children = lightsNode.children;

      this.lights = [];
      var numLights = 0;

      var grandChildren = [];
      var nodeNames = [];

      // Any number of lights.
      for (var i = 0; i < children.length; i++) {

          if (!(children[i].nodeName == "omni" || children[i].nodeName == "spot")) {
              this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
              continue;
          }

          // Get id of the current light.
          var lightId = this.reader.getString(children[i], 'id');
          if (lightId == null)
              return "no ID defined for light";


          // repeated ids.
          if (this.lights[lightId] != null)
              return "ID must be unique for each light (conflict: ID = " + lightId + ")";

          //Get enable index of the current light
          var enableLight = this.reader.getBoolean(children[i],'enabled');

          if(!(enableLight == 0 || enableLight == 1)){
              this.onXMLMinorError("The enable light must be 0 or 1 (false or true). Assuming value 1");
          }


          grandChildren = children[i].children;
          // Specifications for the current light.

          nodeNames = [];
          for (var j = 0; j < grandChildren.length; j++) {
              nodeNames.push(grandChildren[j].nodeName);
          }

          // Gets indices of each element.
          //var enableIndex = nodeNames.indexOf("enable");
          var locationIndex = nodeNames.indexOf("location");
          var ambientIndex = nodeNames.indexOf("ambient");
          var diffuseIndex = nodeNames.indexOf("diffuse");
          var specularIndex = nodeNames.indexOf("specular");


          // Retrieves the light location.
          var locationLight = [];
          if (locationIndex != -1) {
              // x
              var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
              if (!(x != null && !isNaN(x)))
                  return "unable to parse x-coordinate of the light location for ID = " + lightId;
              else
                  locationLight.push(x);

              // y
              var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
              if (!(y != null && !isNaN(y)))
                  return "unable to parse y-coordinate of the light location for ID = " + lightId;
              else
                  locationLight.push(y);

              // z
              var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
              if (!(z != null && !isNaN(z)))
                  return "unable to parse z-coordinate of the light location for ID = " + lightId;
              else
                  locationLight.push(z);

              // w
              var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
              if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                  return "unable to parse x-coordinate of the light location for ID = " + lightId;
              else
                  locationLight.push(w);
          }
          else
              return "light location undefined for ID = " + lightId;

          // Retrieves the ambient component.
          var ambientIllumination = [];
          if (ambientIndex != -1) {
              // R
              var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
              if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                  return "unable to parse R component of the ambient illumination for ID = " + lightId;
              else
                  ambientIllumination.push(r);

              // G
              var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
              if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                  return "unable to parse G component of the ambient illumination for ID = " + lightId;
              else
                  ambientIllumination.push(g);

              // B
              var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
              if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                  return "unable to parse B component of the ambient illumination for ID = " + lightId;
              else
                  ambientIllumination.push(b);

              // A
              var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
              if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                  return "unable to parse A component of the ambient illumination for ID = " + lightId;
              else
                  ambientIllumination.push(a);
          }
          else
              return "ambient component undefined for ID = " + lightId;

          // TODO: Retrieve the diffuse component

          var diffuseIllumination = [];
          if (diffuseIndex != -1) {
              // R
              var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
              if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                  return "unable to parse R component of the diffuse illumination for ID = " + lightId;
              else
                  diffuseIllumination.push(r);

              // G
              var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
              if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                  return "unable to parse G component of the diffuse illumination for ID = " + lightId;
              else
                  diffuseIllumination.push(g);

              // B
              var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
              if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                  return "unable to parse B component of the diffuse illumination for ID = " + lightId;
              else
                  diffuseIllumination.push(b);

              // A
              var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
              if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                  return "unable to parse A component of the diffuse illumination for ID = " + lightId;
              else
                  diffuseIllumination.push(a);
          }  else
                return "diffuse component undefined for ID = " + lightId;

          // TODO: Retrieve the specular component

          var specularIllumination = [];
          if (specularIndex != -1) {
              // R
              var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
              if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                  return "unable to parse R component of the specular illumination for ID = " + lightId;
              else
                  specularIllumination.push(r);

              // G
              var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
              if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                  return "unable to parse G component of the specular illumination for ID = " + lightId;
              else
                  specularIllumination.push(g);

              // B
              var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
              if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                  return "unable to parse B component of the specular illumination for ID = " + lightId;
              else
                  specularIllumination.push(b);

              // A
              var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
              if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                  return "unable to parse A component of the specular illumination for ID = " + lightId;
              else
                  specularIllumination.push(a);
          }  else
                return "specular component undefined for ID = " + lightId;

          // TODO: Store Light global information.
          //this.lights[lightId] = ...;

          //NAO SEI SE O ENABLE LIGHT PODE ESTAR NESTE SITIO
          this.lights[lightId] = [enableLight, locationLight, ambientIllumination, diffuseIllumination, specularIllumination];
          numLights++;

      }

      if (numLights == 0)
          return "at least one light must be defined";
      else if (numLights > 8)
          this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

      this.log("Parsed lights");


      return null;

    }
    /**
     * Parses the <TEXTURES> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // TODO: Parse block
       /* this.textures=[];
        var texture=texturesNode.children;
        for (var i =0;i<texture.length;i++){
            var textID= this.reader.getString(texture[i],'id');
            if (textID==null)
            return "texture failed";
            if (this.textures[textID] != null)
            return "texture id must be unique";
           var specification= texture[i].children;
           var file=null;
           var sFactor=null;
           var tFactor=null;
           for (var j=0;j<)
        }
        console.log("Parsed textures");
*/
        return null;
    }

    parseMaterials(materialsNode){
      return null;
    }
    parseTransformations(transformationsNode){
      return null;
    }
    parsePrimitives(primitivesNode){

      //var children = primitivesNode.getElementsByTagName()







      return null;
    }
    parseComponents(componentsNode){
      return null;
    }
    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        var square = new MyUnitCubeQuad(this.scene,-5,5,-5,5);
        square.display();
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph

    }

}