/** 
 * MyPrism
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPrism extends CGFobject
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
		this.vertices=[];
		this.normals=[];
		this.indices=[];
	    var angle = 2*Math.PI/this.slices;
	    var stack_depth = 1/this.stacks;

//		console.log (this.slices + "\n");
//		console.log (this.stacks + "\n");
		
		for (var j = 0; j < this.stacks; j++)
		{	   
			 for (var i = 0; i < this.slices ; i++)
			 {

	    	this.vertices.push(Math.cos(i*angle), Math.sin(i*angle), stack_depth * j);
	   		this.vertices.push(Math.cos(i*angle), Math.sin(i*angle),stack_depth * (j+1) );
	   		this.vertices.push(Math.cos((i+1)*angle),Math.sin((i+1)*angle),stack_depth * j);
	   		this.vertices.push(Math.cos((i+1)*angle), Math.sin((i+1)*angle),stack_depth * (j+1));
	   		
	   		this.normals.push(Math.cos(i*angle+angle/2),Math.sin(i*angle+angle/2),0);
	   		this.normals.push(Math.cos(i*angle+angle/2),Math.sin(i*angle+angle/2),0);
	   		this.normals.push(Math.cos(i*angle+angle/2),Math.sin(i*angle+angle/2),0);
	   		this.normals.push(Math.cos(i*angle+angle/2),Math.sin(i*angle+angle/2),0);
			
			this.indices.push(0+i*4+j*4*this.slices,2+i*4+j*4*this.slices,1+i*4+j*4*this.slices);
			this.indices.push(2+i*4+j*4*this.slices,3+i*4+j*4*this.slices,1+i*4+j*4*this.slices);

	    	} 
		}
			
//		 	console.log("vertices: " + this.vertices.length + "   " + this.vertices + "\n");
//		 	console.log("normals: " +  this.normals.length + "   " +  this.normals + "\n");
//		 	console.log("indices: " + this.indices.length + "  " + this.indices + "\n");	
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};