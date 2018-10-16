/**
 * Component
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Component {
	constructor(scene, graph, id, transformationMatrix, texture, materialId, primitivesChildren, componentsChildren, materialsList) {
		this.scene = scene;
		this.graph = graph;
		this.id = id;
		this.transformationMatrix = transformationMatrix;
	//	this.textId = textId;
		this.materialId = materialId;
		this.primitivesChildren = primitivesChildren;
		this.componentsChildren = componentsChildren;

		this.texture = texture;
		this.oldTexture = texture;
		this.materialsList = materialsList;
		this.nextMaterialId = 0;
	

		this.length_s;
		this.length_t;
		this.textId;
	}

	analizeTexture(){
		this.texture = this.oldTexture;

		this.length_s = this.texture.getAttribute('length_s');
		this.length_t = this.texture.getAttribute('length_t');

		if(isNaN(this.length_s) || isNaN(this.length_t)){
			this.scene.onXMLMinorError("length_s and length_t must be a valid number.");
		}
		this.textId = this.texture.getAttribute('id');

		if(this.textId == "none")
				this.texture = null;

	}

	display() {
		this.scene.pushMatrix();
		this.scene.multMatrix(this.transformationMatrix);

	///	this.analizeTexture();
		this.graph.materials[this.materialId].setTexture(this.texture);
		this.graph.materials[this.materialId].apply();


		for (var i = 0; i < this.primitivesChildren.length; i++) {
			this.graph.primitives[this.primitivesChildren[i]].display();
		}
		this.scene.popMatrix();
		this.scene.pushMatrix();
		this.scene.multMatrix(this.transformationMatrix);
		this.graph.materials[this.materialId].setTexture(this.texture);
		this.graph.materials[this.materialId].apply();
		for (var i = 0; i < this.componentsChildren.length; i++) {

			//this.graph.components[this.componentsChildren[i]].setTexCoords(this.length_s,this.length_t);
			this.graph.components[this.componentsChildren[i]].display();
		}
		this.scene.popMatrix();

	}




};
