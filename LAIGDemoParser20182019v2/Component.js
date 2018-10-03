/**
 * Component
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Component extends CGFobject
{
	constructor(scene,graph, id, transformationMatrix, textId, materialId, primitivesChildren, componentsChildren)
   {
    super(scene);
		this.graph = graph;
    this.id = id;
    this.transformationMatrix = transformationMatrix;
    this.textId = textId;
	this.materialId = materialId;
	this.primitivesChildren=primitivesChildren;
	this.componentsChildren=componentsChildren;

   }




	 display(){
		console.log("display");
		for (var i = 0; i<this.primitivesChildren.length;i++){
			switch (this.primitivesChildren[i].getAttribute('id')){
				case "square":
				this.graph.primitives[0].display();
				break;
				case "cylinder":
				this.graph.primitives[1].display();
				break;
				default:
			}

		}
	}

};
