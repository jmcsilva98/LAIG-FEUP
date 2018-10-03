/**
 * Component
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class Component extends CGFobject
{
	constructor(scene,graph, id, transformationMatrix, textId, materialId, children)
   {
    super(scene);
		this.graph = graph;
    this.id = id;
    this.transformationMatrix = transformationMatrix;
    this.textId = textId;
    this.materialId = materialId;
    this.children = children;

		this.childrenPrimitives;
		this.childrenComponents;

   }


	 analizesChildren(){

		 for(var i = 0; i < this.children.length ; i++){
			 if(this.children[i].nodeName == "componentref")
				 this.childrenComponents.push(this.children[i]);
			else if(this.children[i].nodeName == "primitivetref")
					 this.childrenPrimitives.push(this.children[i]);
			else
				return "A components children must be either a component or a primitive";
		 }
	 }


	 display(){
		 for(var i = 0; i < this.children.length ; i++){
			 console.log(this.children[i].localName);
			if(this.children[i].localName == "componentref")
				this.childrenComponents.push(this.children[i]);
		 else if(this.children[i].localName == "primitivetref")
					this.childrenPrimitives.push(this.children[i]);
		 else
			 return "A components children must be either a component or a primitive";
			}
		//this.transformationMatrix.pushMatrix();

		for(var i = 0; i < this.childrenPrimitives.length; i++){

			this.graph.primitives[this.childrenPrimitives[i].getAttribute('id')].display();


		//this.transformationMatrix.popMatrix();
	 }
 }

};
