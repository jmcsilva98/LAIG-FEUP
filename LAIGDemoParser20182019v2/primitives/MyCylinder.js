/** 
 * MyPrism
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject
{ 
	constructor(scene, slices, stacks)
   {
		super(scene);
		this.slices = slices;
		this.stacks = stacks;	
		this.initBuffers();

   }
	initBuffers() 
	{
 	var angulo = 2*Math.PI/this.slices;
 	

	this.vertices=[];
 	this.normals=[];
 	 this.indices=[];
 	 this.texCoords = [];

 	var angle = 2*Math.PI/this.slices;
	var stack_depth = 1/this.stacks;
	var a = 1/this.slices;
 	var b = 1/this.stacks;

 	for(var i = 0; i < this.stacks;i++){
 		for(var j = 0; j < this.slices;j++){
 			
 			this.vertices.push(Math.cos(j*angle), Math.sin(j*angle), i * stack_depth);
			this.vertices.push(Math.cos(j*angle), Math.sin(j*angle), (i+1) * stack_depth);

 			this.normals.push(Math.cos(j*angle),Math.sin(j*angle),0);
		    this.normals.push(Math.cos(j*angle),Math.sin(j*angle),0);

			this.texCoords.push(j*a, i*b);
			this.texCoords.push((j+1)*a, i*b);

			if (j == this.slices - 1)
			{
				this.indices.push(0+j*2+i*2*this.slices,0+i*2*this.slices,1+j*2+i*2*this.slices);
				this.indices.push(0+i*2*this.slices,1+i*2*this.slices,1+j*2+i*2*this.slices);
			}
	
			else
			{
		    this.indices.push(0+j*2+i*2*this.slices,2+j*2+i*2*this.slices,1+j*2+i*2*this.slices);
			this.indices.push(2+j*2+i*2*this.slices,3+j*2+i*2*this.slices,1+j*2+i*2*this.slices);
			}
 		}
 	}

/*	for(i=0; i < this.stacks;i++){
		for(j=0; j < this.slices;j++){
				this.indices.push(0+j*4+i*4*this.slices,1+j*4+i*4*this.slices,2+j*4+i*4*this.slices);
				this.indices.push(2+j*4+i*4*this.slices,1+j*4+i*4*this.slices,3+j*4+i*4*this.slices);		}
	}
*/

//	 	console.log("vertices: " + this.vertices.length/3 + "   " + this.vertices + "\n");
//	 	console.log("normals: " +  this.normals.length/3 + "   " +  this.normals + "\n");
//	 	console.log("faces: " + this.indices.length/3 + "  " + this.indices + "\n");
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
	};
};