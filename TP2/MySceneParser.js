var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;


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

    //Arrays that will save the information parsed (data structure)
    this.nodes = [];
    this.textures = [];
    this.transformations = [];
    this.components = [];
    this.views = [];
    this.animations=[];
    this.defaultView; //Default view of the camera

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
    //<ANIMATIONS>
    if ((index = nodeNames.indexOf("animations")) == -1)
    return "tag <animations> missing";
  else {
    if (index != ANIMATIONS_INDEX)
      this.onXMLMinorError("tag <animations> out of order");

    //Parse ANIMATIONS block
    if ((error = this.parseAnimations(nodes[index])) != null) {
      return error;

    }
  }
    // <PRIMITIVES>
    if ((index = nodeNames.indexOf("primitives")) == -1)
      return "tag <primitives> missing";
    else {
      if (index != PRIMITIVES_INDEX)
        this.onXMLMinorError("tag <primitives> out of order");

      //Parse PRIMITIVES block
      if ((error = this.parsePrimitives(nodes[index])) != null) {
        return error;

      }
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

  //--------------------------------PARSE SCENE ------------------------------------------//
  parseScene(sceneNode) {
    //gets the root attribute of the node and tests if it's valid
    var rootName = sceneNode.getAttribute("root");
    if (rootName == null)
      this.onXMLMinorError("There's no scene name.");
    else
      this.rootName = rootName;

    var axisLength = sceneNode.getAttribute("axis_length");
    //If the number in the attribute 'axis_length' isn't a valid number, we assume the value as 1
    if (isNaN(axisLength)) {
      this.onXMLMinorError("Not a valid axis length; assuming value=1");
      this.referenceLength = 1;
    } else
      this.referenceLength = axisLength;

    console.log("Parsed Scene");
    return null;
  }

  //--------------------------------PARSE VIEWS ------------------------------------------//
  parseViews(viewsNode) {
    var view = viewsNode.children;

    //gets the default view id and saves it in the global variable defaultView
    this.defaultView = viewsNode.getAttribute("default");
    if (this.defaultView == null)
      this.onXMLMinorError("There's no default view name.");

    //error if the views tag doesn't have any children
    if (view.length == 0)
      return "You need to have at least one type of view defined.";

    var perspective = viewsNode.getElementsByTagName('perspective');
    var ortho = viewsNode.getElementsByTagName('ortho');
    if (perspective.length == 0)
      this.onXMLMinorError("There isn't any block perspective.");

    if (ortho.length == 0)
      this.onXMLMinorError("There isn't any block ortho.");

    //Goes through all of the children of views and saves the data according to the type of view
    for (var i = 0; i < view.length; i++) {
      var nodeName = view[i].nodeName;

        //Analyses the perspective tag
      if (nodeName == "perspective") {
        var viewId = this.reader.getString(view[i], 'id');
        if (viewId == null)
          return "The view number " + i + " doesn't have id.";

        var angle = this.reader.getFloat(view[i], 'angle');
        if (angle == null) {
          this.onXMLMinorError("The view number " + i + " doesn't have angle. Assuming that angle is 0");
          angle = 0;
        }
        //passes the angle from degrees to rad
        angle *= DEGREE_TO_RAD;

        var near = this.reader.getFloat(view[i], 'near');
        if (near == null) {
          this.onXMLMinorError("The view number " + i + " doesn't have near value.Assuming that near is 0");
          near = 0;
        }

        var far = this.reader.getFloat(view[i], 'far');
        if (far == null) {
          this.onXMLMinorError("The view number " + i + " doesn't have far value.Assuming assume that value is 10");
          far = 10;
        }

        var perspectiveChildren = view[i].children;
        if (perspectiveChildren.length < 2) {
          return "Perspective view must have from and to values.";
        }

        for (var j = 0; j < perspectiveChildren.length; j++) {
          var nodeName = perspectiveChildren[j].nodeName;
          if (nodeName == "from") {
            var xfrom = this.reader.getFloat(perspectiveChildren[j], 'x');
            var yfrom = this.reader.getFloat(perspectiveChildren[j], 'y');
            var zfrom = this.reader.getFloat(perspectiveChildren[j], 'z');
          } else if (nodeName == "to") {
            var xto = this.reader.getFloat(perspectiveChildren[j], 'x');
            var yto = this.reader.getFloat(perspectiveChildren[j], 'y');
            var zto = this.reader.getFloat(perspectiveChildren[j], 'z');
          }
        }

        //Creates a new CGFcamera and adds it to the views global array
        this.views[viewId] = new CGFcamera(angle, near, far, vec3.fromValues(xfrom, yfrom, zfrom), vec3.fromValues(xto, yto, zto)); //the new camera view is added to the array

      //Analyses the ortho tag
      } else if (nodeName == "ortho") {
        var viewId = this.reader.getString(view[i], 'id');
        if (viewId == null) {
          return "The view number " + i + " doesn't have id.";
        }
        var left = this.reader.getFloat(view[i], 'left');
        if (left == null) {
          this.onXMLMinorError("The view number " + i + " doesn't have left value. Assuming assume that left is -5");
          left = -5;
        }
        var right = this.reader.getFloat(view[i], 'right');
        if (right == null) {
          this.onXMLMinorError("The view number " + i + " doesn't have right value. Assuming assume that right is 5");
          right = 5;
        }
        var bottom = this.reader.getFloat(view[i], 'bottom');
        if (bottom == null) {
          this.onXMLMinorError("The view number " + i + " doesn't have bottom value. Assuming assume that bottom is -5");
          bottom = -5;
        }

        var top = this.reader.getFloat(view[i], 'top');
        if (top == null) {
          this.onXMLMinorError("The view number " + i + " doesn't have top value. Assuming assume that top is 5");
          top = 5;
        }
        var near = this.reader.getFloat(view[i], 'near');
        if (near == null) {
          this.onXMLMinorError("The view number " + i + " doesn't have near value. Assuming assume that left is 0");
          left = 0;
        }
        var far = this.reader.getFloat(view[i], 'far');
        if (far == null) {
          this.onXMLMinorError("The view number " + i + " doesn't have far value. Assuming assume that far is 30");
          left = 30;
        }
        var orthoChildren = view[i].children;
        if (orthoChildren.length < 2) {
          this.onXMLError("Orthographic camera must have from and to positions.");
        }
        for (var j = 0; j < orthoChildren.length; j++) {
          var nodeName = orthoChildren[j].nodeName;
          if (nodeName == "from") {
            var xfrom = this.reader.getFloat(perspectiveChildren[j], 'x');
            var yfrom = this.reader.getFloat(perspectiveChildren[j], 'y');
            var zfrom = this.reader.getFloat(perspectiveChildren[j], 'z');
          } else if (nodeName == "to") {
            var xto = this.reader.getFloat(perspectiveChildren[j], 'x');
            var yto = this.reader.getFloat(perspectiveChildren[j], 'y');
            var zto = this.reader.getFloat(perspectiveChildren[j], 'z');
          }
        }

        //Creates a new CGFcameraOrtho and adds it to the views global array
        this.views[viewId] = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(xfrom, yfrom, zfrom), vec3.fromValues(xto, yto, zto), vec3.fromValues(0, 1, 0));
      }
      //If the tag name isn't either perspective or ortho, there's an error
       else {
        this.onXMLMinorError(this.onXMLMinorError("unknown tag <" + nodeName + ">"));
      }
    }
    console.log("Parsed Views");
    return null;
  }

  //--------------------------------PARSE AMBIENT ----------------------------------------//
  parseAmbient(ambientNode) {
    var ambient = ambientNode.getElementsByTagName('ambient');
    var background = ambientNode.getElementsByTagName('background');
    this.ambientIlumination = [0, 1, 0, 0];
    this.backgroundIlumination = [0, 0, 0, 1];

    if (ambient.length > 1)
      return "no more than one initial ambient may be defined";

    if (background.length > 1)
      return "no more than one initial background may be defined";
    //analyses rgba elements for the ambient
    //R
    var rAmbient = this.reader.getFloat(ambient[0], 'r');
    if (!(rAmbient == null || rAmbient < 0 || rAmbient > 1)) {
      this.ambientIlumination[0] = rAmbient;
    } else
      this.onXMLError("R ambient component must have a number between 0 and 1");
    //G
    var gAmbient = this.reader.getFloat(ambient[0], 'g');
    if (!(gAmbient == null || gAmbient < 0 || gAmbient > 1)) {
      this.ambientIlumination[1] = gAmbient;
    } else
      this.onXMLMinorError("G ambient component must have a number between 0 and 1");
    //B
    var bAmbient = this.reader.getFloat(ambient[0], 'b');
    if (!(bAmbient == null || bAmbient < 0 || bAmbient > 1)) {
      this.ambientIlumination[2] = bAmbient;
    } else
      this.onXMLMinorError("B ambient component must have a number between 0 and 1");
    //A
    var aAmbient = this.reader.getFloat(ambient[0], 'a');
    if (!(aAmbient == null || aAmbient < 0 || aAmbient > 1)) {
      this.ambientIlumination[3] = aAmbient;
    } else
      this.onXMLError("A ambient component must have a number between 0 and 1");

    //analyses rgba elements for the background
    //R
    var rBackground = this.reader.getFloat(background[0], 'r');
    if (!(rBackground == null || rBackground < 0 || rBackground > 1)) {
      this.backgroundIlumination[0] = rBackground;
    } else
      this.onXMLError("R background component must have a number between 0 and 1");
    //G
    var gBackground = this.reader.getFloat(background[0], 'g');
    if (!(gBackground == null || gBackground < 0 || gBackground > 1)) {
      this.backgroundIlumination[1] = gBackground;
    } else
      this.onXMLError("G background component must have a number between 0 and 1");
    //B
    var bBackground = this.reader.getFloat(background[0], 'b');
    if (!(bBackground == null || bBackground < 0 || bBackground > 1)) {
      this.backgroundIlumination[2] = bBackground;
    } else
      this.onXMLError("B background component must have a number between 0 and 1");
    //A
    var aBackground = this.reader.getFloat(background[0], 'a');
    if (!(aBackground == null || aBackground < 0 || aBackground > 1)) {
      this.backgroundIlumination[3] = aBackground;
    } else
      this.onXMLError("A background component must have a number between 0 and 1");

    console.log("Parsed Ambient");
    return null;
  }

  //--------------------------------PARSE LIGHTS -----------------------------------------//
  parseLights(lightsNode) {
    var children = lightsNode.children;

    this.lights = [];
    var numLights = 0;

    var grandChildren = [];
    var nodeNames = [];

    //Error if there is no light defined
    if (children.length == 0)
      return "You have to have at least one light.";

    // Any number of lights.
    for (var i = 0; i < children.length; i++) {
      var type = children[i].nodeName;
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
      var enableLight = this.reader.getBoolean(children[i], 'enabled');
      if (!(enableLight == 0 || enableLight == 1)) {
        this.onXMLMinorError("The enable light must be 0 or 1 (false or true). Assuming value 1");
        enableLight = 1;
      }


      grandChildren = children[i].children;
      // Specifications for the current light.
      if (children[i].nodeName == "omni") {
        if (grandChildren.length != 4) {
          this.onXMLError("The omni light should must 4 components");
        }
      } else if (children[i].nodeName == "spot") {
        if (grandChildren.length != 5) {
          this.onXMLError("The omni light should must 4 components");
        }
      }
      nodeNames = [];
      for (var j = 0; j < grandChildren.length; j++) {
        nodeNames.push(grandChildren[j].nodeName);
      }

      // Gets indices of each element.
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
      } else
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
      } else
        return "ambient component undefined for ID = " + lightId;


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
      } else
        return "diffuse component undefined for ID = " + lightId;


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
      } else
        return "specular component undefined for ID = " + lightId;
      if (children[i].nodeName == 'spot') {
        var targetIllumination = [];
        var targetIndex = nodeNames.indexOf("target");
        var x = this.reader.getFloat(grandChildren[targetIndex], 'x')
        if (!(x != null && !isNaN(x)))
          return "unable to parse X component of the specular illumination for ID = " + lightId;
        else
          targetIllumination.push(x);
        var y = this.reader.getFloat(grandChildren[targetIndex], 'y')
        if (!(y != null && !isNaN(y)))
          return "unable to parse y component of the specular illumination for ID = " + lightId;
        else
          targetIllumination.push(y);
        var z = this.reader.getFloat(grandChildren[targetIndex], 'z')
        if (!(z != null && !isNaN(z)))
          return "unable to parse X component of the specular illumination for ID = " + lightId;
        else
          targetIllumination.push(z);

        //saves the light information in a array of lights, with the current light id
        var angleLight = this.reader.getFloat(children[i], 'angle') * DEGREE_TO_RAD;
        var exponentLight = this.reader.getFloat(children[i], 'exponent');
        this.lights[lightId] = [type, enableLight, angleLight, exponentLight, locationLight, targetIllumination, ambientIllumination, diffuseIllumination, specularIllumination, type];

      } else
        this.lights[lightId] = [type, enableLight, locationLight, ambientIllumination, diffuseIllumination, specularIllumination];

      numLights++;
    }

    if (numLights == 0)
      return "at least one light must be defined";
    else if (numLights > 8)
      this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

    this.log("Parsed lights");
    return null;
  }
//--------------------------------PARSE TEXTURES -----------------------------------------------//
  parseTextures(texturesNode) {

    var textures = texturesNode.children;
    //Error if there isn't any texture defined
    if (textures.length == 0)
      this.onXMLMinorError("You must have at least one texture.");

    //Goes through all of the textures tag children
    for (var i = 0; i < textures.length; i++) {
      if (textures[i].nodeName != "texture") {
        this.onXMLMinorError("The tag texture isn't 'texture' but " + textures[i].nodeName);
      }
      var textID = this.reader.getString(textures[i], 'id');

      //checks for errors in the id and file (already existing id, null values)
      if (textID == null)
        return "A texture must have an id.";
      if (this.textures[textID] != null)
        return "A texture id must be unique, please change the id: " + textID + " .";
      var file = this.reader.getString(textures[i], 'file');
      if (file == null)
        return "There isn't a file path, please enter one.";

      //creates a new texture according to the data acquired and saves it into the textures array
      var newTexture = new CGFtexture(this.scene, file);
      this.textures[textID] = newTexture;
    }
    console.log("Parsed textures");
    return null;
  }
  //--------------------------------PARSE MATERIALS -------------------------------------------//
  parseMaterials(materialsNode) {
    this.materials = [];

    var materials = materialsNode.children;
    if (materials.length == 0)
      this.onXMLMinorError("You must have at least one material.");

    //Goes through all of the materials block children
    for (var i = 0; i < materials.length; i++) {
      //checks the tag name
      if (materials[i].nodeName != "material")
        this.onXMLMinorError("The tag material isn't 'material' but " + materials[i].nodeName);

      //retrieves the id and shininess of the current material
      var matId = this.reader.getString(materials[i], 'id');
      var shininess = this.reader.getFloat(materials[i], 'shininess');

      //checks for errors (existing id, null and not valid number)
      if (matId == null)
        this.onXMLError("A material must have an id.");
      if (this.materials[matId] != null)
        this.onXMLError("A material id must be unique, please change the id: " + matId + " .");
      if (isNaN(shininess)) {
        this.onXMLMinorError("shininess must be a valid float.Assuming that shininess value is 10");
        shininess = 10;
      }

      //saves the parsed information of rgba to the arrays listed
      var emission = this.parseRgba(materials[i].getElementsByTagName('emission')[0]);
      var ambient = this.parseRgba(materials[i].getElementsByTagName('ambient')[0]);
      var diffuse = this.parseRgba(materials[i].getElementsByTagName('diffuse')[0]);
      var specular = this.parseRgba(materials[i].getElementsByTagName('specular')[0]);

      //creates a new material, sets the components and saves it to the materials array
      var newMaterial = new CGFappearance(this.scene);
      newMaterial.setEmission(emission[0], emission[1], emission[2], emission[3]);
      newMaterial.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
      newMaterial.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
      newMaterial.setSpecular(specular[0], specular[1], specular[2], specular[3]);
      newMaterial.setShininess(shininess);

      this.materials[matId] = newMaterial;
    }
    console.log("Parsed Materials");
    return null;
  }
  //--------------------------------PARSE RGBA ---------------------------------------------//
  //Function that parses the rgba elements, checks if they are valid and puts them in an array
  parseRgba(element) {
    var rgba = [];

    var r = this.reader.getFloat(element, 'r');
    if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
      this.onXMLError("unable to parse R component.");
    else
      rgba.push(r);
    var g = this.reader.getFloat(element, 'g');
    if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
      this.onXMLError("unable to parse G component.");
    else
      rgba.push(g);
    var b = this.reader.getFloat(element, 'b');
    if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
      this.onXMLError("unable to parse B component.");
    else
      rgba.push(b);
    var a = this.reader.getFloat(element, 'a');
    if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
      this.onXMLError("unable to parse A component.");
    else
      rgba.push(a);

    //returns the array created with the rgba elements parsed
    return rgba;
  }

//--------------------------------PARSE TRANSFORMATIONS -----------------------------------//

  parseTransformations(transformationsNode) {
    //creates an identity matrix
    var identMatrix = mat4.create();
    if (transformationsNode.children.length == 0) {
      this.onXMLError("There must be at least one or more transformation block.");
    }
    for (var i = 0; i < transformationsNode.children.length; i++) {
      if (transformationsNode.children[i].nodeName != "transformation") {
        this.onXMLMinorError("The tag transformation isn't 'transformation' but " + transformationsNode.children.nodeName);
      }
      var transformations = transformationsNode.children[i].children;
      identMatrix = mat4.create();
      if (transformations.length == 0) {
        this.onXMLError("There must be at least one transformation");
      }
      for (var j = 0; j < transformations.length; j++) {
        var vector = vec3.create();
        var x, y, z;

        //analyses the transformation according to the type, can be in any order
        switch (transformations[j].nodeName) {
          case "translate":
            x = this.reader.getFloat(transformations[j], 'x');
            y = this.reader.getFloat(transformations[j], 'y');
            z = this.reader.getFloat(transformations[j], 'z');
            vec3.set(vector, x, y, z);
            //applies the transformation to the matrix
            mat4.translate(identMatrix, identMatrix, vector);

            break;
          case "rotate":
          //applies the transformation to the matrix according to the axis of rotation
            if (transformations[j].getAttribute('axis') == "x")
              mat4.rotateX(identMatrix, identMatrix, transformations[j].getAttribute('angle') * DEGREE_TO_RAD);
            else if (transformations[j].getAttribute('axis') == "y")
              mat4.rotateY(identMatrix, identMatrix, transformations[j].getAttribute('angle') * DEGREE_TO_RAD);
            else if (transformations[j].getAttribute('axis') == "z") {
              mat4.rotateZ(identMatrix, identMatrix, transformations[j].getAttribute('angle') * DEGREE_TO_RAD);
            } else {
              this.onXMLError("The axis must be x,y or z. Please change." + j + " transformation doesn't have a valid axis on rotation.");
            }
            break;
          case "scale":
            x = this.reader.getFloat(transformations[j], 'x');
            y = this.reader.getFloat(transformations[j], 'y');
            z = this.reader.getFloat(transformations[j], 'z');
            if (x == 0 || y == 0 || z == 0) {
              this.onXMLError("There's in a value on scale in tranformation " + i + "that is 0. Please change");
            }
            vec3.set(vector, x, y, z);
            //applies the transformation to the matrix
            mat4.scale(identMatrix, identMatrix, vector);
            break;
          default:

        }
      }
      //adds the transformation matrix to the trasnformations array (by the id of the node)
      this.transformations[transformationsNode.children[i].getAttribute('id')] = identMatrix;
    }
    console.log("Parsed Transformations");
    return null;
  }
   //--------------------------------PARSE ANIMATIONS -----------------------------------//
   parseAnimations(animationsNode){
     if (animationsNode==null)
     this.onXMLError("animations node doesn't exist!");

   if (animationsNode.children.length == 0) {
    this.onXMLMinorError ("animations node is empty!");//ALTERAR PARA onXMLError!!
  }
else{
  var linearAnimations=animationsNode.getElementsByTagName('linear');
  var circularAnimations=animationsNode.getElementsByTagName('circular');
  var i, j, animation,id,span;
  for ( i = 0; i < linearAnimations.length;i++){
         id = this.reader.getString(linearAnimations[i],'id');
        if (this.animations[id]!=null) this.onXMLError("There can't have more than one animation with same id");
         span = this.reader.getFloat(linearAnimations[i],'span');
        var controlPoints = linearAnimations[i].getElementsByTagName('controlpoint');
        if (controlPoints.length < 2)
          this.onXMLError("there must have at least 2 control points!");
       else{ var cPoints = [];
        for ( j = 0; j< controlPoints.length;j++){
            var vector = vec3.create();
            var x , y , z;
            x = this.reader.getFloat(controlPoints[j],'xx');
            y = this.reader.getFloat(controlPoints[j],'yy');
            z = this.reader.getFloat(controlPoints[j],'zz');
            vec3.set(vector,x,y,z);
            cPoints[j]=vector;
        }
        animation = new LinearAnimation(this.scene,id,span,cPoints);
        this.animations[id]=animation;
      }

    }
    var center, radius, startang,rotang;
    for ( i = 0 ; i< circularAnimations.length;i++){
      id = this.reader.getString(circularAnimations[i],'id');
      if (this.animations[id]!=null) this.onXMLError("There can't have more than one animation with same id");
      span = this.reader.getFloat(circularAnimations[i],'span');
      center = this.reader.getVector3(circularAnimations[i],'center');
      radius = this.reader.getFloat(circularAnimations[i],'radius');
      startang = this.reader.getFloat(circularAnimations[i],'startang');
      rotang = this.reader.getFloat(circularAnimations[i],'rotang');
      animation = new CircularAnimation(this.scene,id,span,center,radius,startang,rotang);
      this.animations[id]=animation;
      console.log("ANIMATION",this.animations[id]);
    }

    console.log(id);

}
}

  //--------------------------------PARSE CONTROLPOINTS ----------------------------------//
  
  parseControlPoints(controlPoints){
    var cPoints = [];

    for(var i = 0; i < controlPoints.length; i++){

      var point = vec3.create();
      var x , y , z;
      x = this.reader.getFloat(controlPoints[i],'xx');
      y = this.reader.getFloat(controlPoints[i],'yy');
      z = this.reader.getFloat(controlPoints[i],'zz');
      vec3.set(point,x,y,z);
      cPoints.push(point);
  
    }

    return cPoints;
  }

  //--------------------------------PARSE PRIMITIVES -----------------------------------//
  parsePrimitives(primitivesNode) {

    if (primitivesNode == null) {
      this.onXMLError("primitives node doesn't exist!");
    }
    if (primitivesNode.children.length == 0) {
      this.onXMLError("primitives node is empty!");
    }

    //Goes through all of the primitives block children
    for (var i = 0; i < primitivesNode.children.length; i++) {
      this.primitives = [];
      //checks for errors
      if (primitivesNode.children[i].nodeName != "primitive") {
        this.onXMLMinorError("The tag primitive isn't 'primitive' but " + primitivesNode.children.nodeName);
      }
      if (primitivesNode == null) {
        this.onXMLError("primitives node doesn't exist!");
      }
      if (primitivesNode.children.length == 0) {
        this.onXMLError("primitives node is empty!");
      }

      for (var i = 0; i < primitivesNode.children.length; i++) {
        var node = primitivesNode.children[i];
        var primitive;
        var id = this.reader.getString(node, 'id');
        if (id == null) {
          this.onXMLMinorError("Primitive id is null.");
        }
        if (this.primitives[id]) {
          this.onXMLError("Can't have more than one primitive with the same id: " + id);
        }
        //creates new primitive according to the node name
        switch (node.children[0].nodeName) {
          case "rectangle":
            this.primitives[id] = new MyQuad(this.scene, this.reader.getFloat(node.children[0], 'x1'), this.reader.getFloat(node.children[0], 'x2'), this.reader.getFloat(node.children[0], 'y1'), this.reader.getFloat(node.children[0], 'y2'));
            break;
          case "cylinder":
            this.primitives[id] = new MyCylinder(this.scene, this.reader.getFloat(node.children[0], 'base'), this.reader.getFloat(node.children[0], 'top'), this.reader.getFloat(node.children[0], 'height'), this.reader.getInteger(node.children[0], 'slices'), this.reader.getInteger(node.children[0], 'stacks'));
            break;
          case "triangle":
            this.primitives[id] = new MyTriangle(this.scene, this.reader.getFloat(node.children[0], 'x1'), this.reader.getFloat(node.children[0], 'y1'), this.reader.getFloat(node.children[0], 'z1'), this.reader.getFloat(node.children[0], 'x2'), this.reader.getFloat(node.children[0], 'y2'), this.reader.getFloat(node.children[0], 'z2'), this.reader.getFloat(node.children[0], 'x3'), this.reader.getFloat(node.children[0], 'y3'), this.reader.getFloat(node.children[0], 'z3'));
            break;
          case "sphere":
            this.primitives[id] = new MySphere(this.scene, this.reader.getFloat(node.children[0], 'radius'), this.reader.getInteger(node.children[0], 'slices'), this.reader.getInteger(node.children[0], 'stacks'));
            break;
          case "torus":
            this.primitives[id] = new MyTorus(this.scene, this.reader.getFloat(node.children[0], 'inner'), this.reader.getFloat(node.children[0], 'outer'), this.reader.getInteger(node.children[0], 'slices'), this.reader.getInteger(node.children[0], 'loops'));
            break;
          case "plane":
            this.primitives[id] = new MyPlane(this.scene,this.reader.getInteger(node.children[0], 'npartsU'),this.reader.getInteger(node.children[0], 'npartsV'));
            break;
          case "patch":
            this.primitives[id] = new MyPatch(this.scene, this.reader.getInteger(node.children[0], 'npointsU'), this.reader.getInteger(node.children[0], 'npointsV'),this.reader.getInteger(node.children[0], 'npartsU'),this.reader.getInteger(node.children[0], 'npartsV'), this.parseControlPoints(node.children[0].children));
            break;
          default:

        }
      }
      console.log("Parsed Primitives");
      return null;
    }
  }


  //--------------------------------PARSE COMPONENTS -----------------------------------//
  parseComponents(componentsNode) {
    var component = componentsNode.children;
    //creates an identity matrix
    var identMatrix = mat4.create();
    //default material of the component
    var defaultMaterial;

    if (component.length == 0)
      return "Must have at least one component";


    //Goes through all component blocks
    for (var i = 0; i < component.length; i++) {
      var componentId = this.reader.getString(component[i], 'id');
      if (component[i].nodeName != "component") {
        this.onXMLMinorError("The tag component isn't 'component' but " + component[i].nodeName);
      }
      if (componentId == null)
        return "There is no id for the component, please enter one.";
      if (!(this.components[componentId] == null))
        return ("There can't be components with the same id: " + componentId + ".");

      //-----------------------TRANSFORMATIONS------------------------------------//

      if (component[i].getElementsByTagName('transformation').length == 0) {
        this.onXMLMinorError("There must be a transformation block!");
      }
      if (component[i].getElementsByTagName('transformation').length > 1) {
        this.onXMLMinorError("There can't have more than one transformation block!");
      }
      var transformations = component[i].getElementsByTagName('transformation')[0].children;

      identMatrix = mat4.create();
      for (var j = 0; j < transformations.length; j++) {
        var vector = vec3.create();
        var x, y, z;


        switch (transformations[j].nodeName) {
          case "translate":
            x = this.reader.getFloat(transformations[j], 'x');
            y = this.reader.getFloat(transformations[j], 'y');
            z = this.reader.getFloat(transformations[j], 'z');
            vec3.set(vector, x, y, z);

            mat4.translate(identMatrix, identMatrix, vector);

            break;
          case "rotate":
            if (transformations[j].getAttribute('axis') == "x")
              mat4.rotateX(identMatrix, identMatrix, transformations[j].getAttribute('angle') * DEGREE_TO_RAD);
            else if (transformations[j].getAttribute('axis') == "y")
              mat4.rotateY(identMatrix, identMatrix, transformations[j].getAttribute('angle') * DEGREE_TO_RAD);
            else if (transformations[j].getAttribute('axis') == "z") {
              mat4.rotateZ(identMatrix, identMatrix, transformations[j].getAttribute('angle') * DEGREE_TO_RAD);
            } else {
              this.onXMLError("The axis must be x,y or z. Please change");
            }
            break;
          case "scale":
            x = this.reader.getFloat(transformations[j], 'x');
            y = this.reader.getFloat(transformations[j], 'y');
            z = this.reader.getFloat(transformations[j], 'z');
            vec3.set(vector, x, y, z);
            mat4.scale(identMatrix, identMatrix, vector);
            if (x == 0 || y == 0 || z == 0) {
              this.onXMLError("There's in a value on scale in tranformation " + i + "that is 0. Please change");

            }
            break;
          //if it is an existing transformation, goes to the transformations array and gets the transformation with the same id
          case "transformationref":
            identMatrix = this.transformations[transformations[j].getAttribute('id')];
            break;
          default:

        }
      }
      var animations= component[i].getElementsByTagName('animations')[0].children;
      var animationsID=[];
     
     for (var j = 0; j<animations.length;j++)
        animationsID.push(this.reader.getString(animations[0],'id'));
    
      //-----------------------MATERIALS------------------------------------//

      var materials = component[i].getElementsByTagName('material');
      //materials list that will contain the ids of the materials listed in the tag
      var materialsList = [];
      if (materials.length < 1)
        this.onXMLMinorError("You need to have at least one material, please input one.");

      //the default material is always the first one
      defaultMaterial = this.reader.getString(materials[0], 'id');
      //if we have more than one material listed and the it's a valid one, the id is pushed to the materialsList array
      if (materials.length > 1) {
        for (var j = 0; j < materials.length; j++) {
          var id = this.reader.getString(materials[j], 'id');

          if ((!this.materials[id] || id == null) && id != "inherit")
            return "Undefined material id: " + id;

          materialsList.push(id);
        }
      }

      //-----------------------TEXTURES------------------------------------//

      var textures = component[i].getElementsByTagName('texture');
      if (textures.length > 1) {
        this.onXMLMinorError("Only one tag texture is possible in the components block.");
      } else if (textures.length == 0) {
        this.onXMLMinorError("You need one tag texture in the components block.");
      }
      //gets the first element with the tag texture
      var texture = component[i].getElementsByTagName('texture')[0];
      var textId = this.reader.getString(texture, 'id');

      //checks if the texture id is valid
      if (textId != "inherit" && textId != "none" && !this.textures[textId])
        this.onXMLMinorError("Not a valid texture. Id " + textId + " .");

      //analyses length_s and length_t (if the texture is inherit, if we don't have values the value is of the parent)
      var inheritWithParameters = true;
      var length_s = null;
      var length_t = null;
      if (textId == "inherit") {
        if (!texture.hasOwnProperty('length_s'))
          inheritWithParameters = false;
        else
          length_s = this.reader.getFloat(texture, 'length_s');
        if (!texture.hasOwnProperty('length_t'))
          inheritWithParameters = false;
        else
          length_t = this.reader.getFloat(texture, 'length_t');
      }
      if (textId != "none" && inheritWithParameters) {
        length_s = this.reader.getFloat(texture, 'length_s');
        length_t = this.reader.getFloat(texture, 'length_t');
        if (isNaN(length_s) || isNaN(length_t)) {
          this.scene.onXMLMinorError("length_s and length_t must be a valid number.");
        }
      }

      //-----------------------CHILDREN------------------------------------//

      var childrenArray = component[i].getElementsByTagName('children')[0];
      var primitivesChildren = childrenArray.getElementsByTagName('primitiveref');
      var componentsChildren = childrenArray.getElementsByTagName('componentref');
      //checks if the component has children
      if (childrenArray.children.length == 0) {
        return "A component must have children! Component: " + componentId;
      }
      var primitivesId = [];
      var componentsId = [];
      for (var j = 0; j < primitivesChildren.length; j++) {
        primitivesId.push(primitivesChildren[j].getAttribute('id'));
      }

      for (var j = 0; j < componentsChildren.length; j++) {
        componentsId.push(componentsChildren[j].getAttribute('id'));
      }

      //creates a new component(from the class Component)
      var newComponent = new Component(this.scene, this, componentId, identMatrix, textId, length_s, length_t, defaultMaterial, primitivesId, componentsId, materialsList,animationsID);
      //adds the new component to the global components array, with the id of the component
      this.components[componentId] = newComponent;
    }

    console.log("Parsed Components");
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


    // entry point for graph rendering (calls the display of the first component)
    this.components[this.rootName].display(this.components[this.rootName].materialId, this.components[this.rootName].textId, this.components[this.rootName].length_s, this.components[this.rootName].length_t);

  }

}
