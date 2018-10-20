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
		this.materialId = materialId;
		this.primitivesChildren = primitivesChildren;
		this.componentsChildren = componentsChildren;

		this.materialsList = materialsList;
		this.nextMaterialId = 0;
		this.oldMaterial = materialId;


		this.length_s = length_s;
		this.length_t = length_t;

	}

	analizeTexture(){
	

		if(this.textId != "none"){

		if(isNaN(this.length_s) || isNaN(this.length_t)){
			this.scene.onXMLMinorError("length_s and length_t must be a valid number.");
		}
		}
		else
				this.graph.textures[this.textId] = null;



	}

	display(parentMaterial, parentTexture,parentS,parentT) {
		this.scene.pushMatrix();
		this.scene.multMatrix(this.transformationMatrix);
		var currentMaterial, currentTexture,currentS,currentT;

		if(this.materialId == "inherit")
			currentMaterial = parentMaterial;
		else
			currentMaterial = this.materialId;

		if(this.textId == "inherit")
			currentTexture = parentTexture;
		else
			currentTexture = this.textId;
		if (this.length_s==null)
			currentS=parentS;

		else
			currentS=this.length_s;

		if (this.length_t == null)
			currentT= parentT;
		else
			currentT=this.length_t;
		
		this.graph.materials[currentMaterial].setTexture(this.graph.textures[currentTexture]);
		this.graph.materials[currentMaterial].apply();

		for (var i = 0; i < this.primitivesChildren.length; i++) {

			this.graph.primitives[this.primitivesChildren[i]].updateTexCoords(currentS,currentT);
			this.graph.primitives[this.primitivesChildren[i]].display();

		}
		this.scene.popMatrix();
		this.scene.pushMatrix();
		this.scene.multMatrix(this.transformationMatrix);
		
		this.graph.materials[currentMaterial].setTexture(this.texture);
		this.graph.materials[currentMaterial].apply();
		
		for (var i = 0; i < this.componentsChildren.length; i++) {
			this.graph.components[this.componentsChildren[i]].display(currentMaterial,currentTexture,currentS,currentT);
		}
		this.scene.popMatrix();

	}




};
