/**
 * Component
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Component {
  constructor(scene, graph, id, transformationMatrix, textId, length_s, length_t, materialId, primitivesChildren, componentsChildren, materialsList) {
    this.scene = scene;
    this.graph = graph;
    this.id = id;
    this.transformationMatrix = transformationMatrix;
    this.textId = textId;
    this.length_s = length_s;
    this.length_t = length_t;
    this.materialId = materialId;
    this.primitivesChildren = primitivesChildren;
    this.componentsChildren = componentsChildren;

    this.materialsList = materialsList; //list of the materials id
    this.nextMaterialId = 0; //index of the next material of the list
    this.oldMaterial = materialId;

  }

	//function that displays the component, having as paremeters the parents material, texture, length_s and length_t
  display(parentMaterial, parentTexture, parentS, parentT) {
    this.scene.pushMatrix();
    this.scene.multMatrix(this.transformationMatrix);
    var currentMaterial, currentTexture, currentS, currentT;

		//if the id of the material is inherit the current material is the material of the parent
    if (this.materialId == "inherit")
      currentMaterial = parentMaterial;
    else
      currentMaterial = this.materialId;
		//if the id of the texture is inherit the current texture is the texture of the parent
    if (this.textId == "inherit")
      currentTexture = parentTexture;
    else
      currentTexture = this.textId;
		//if there is no value for the length, it inherits from the parent node
		if (this.length_s == null)
      currentS = parentS;
    else
      currentS = this.length_s;
    if (this.length_t == null)
      currentT = parentT;
    else
      currentT = this.length_t;

		//sets the texture and applies the material of the component
    this.graph.materials[currentMaterial].setTexture(this.graph.textures[currentTexture]);
    this.graph.materials[currentMaterial].apply();

		//Goes through all the children of the component that are primitives
    for (var i = 0; i < this.primitivesChildren.length; i++) {

      this.graph.primitives[this.primitivesChildren[i]].updateTexCoords(currentS, currentT);
      this.graph.primitives[this.primitivesChildren[i]].display();

    }
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.multMatrix(this.transformationMatrix);

    this.graph.materials[currentMaterial].setTexture(this.texture);
    this.graph.materials[currentMaterial].apply();

		//Goes through all the children of the component that are components
    for (var i = 0; i < this.componentsChildren.length; i++) {
      this.graph.components[this.componentsChildren[i]].display(currentMaterial, currentTexture, currentS, currentT);
    }
    this.scene.popMatrix();

  }




};
