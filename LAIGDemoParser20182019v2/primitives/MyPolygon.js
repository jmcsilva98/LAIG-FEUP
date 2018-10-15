/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class MyPolygon extends CGFobject
{
  constructor(scene, slices, radius){
  super(scene);
	this.slices = slices;
  this.radius = radius;


	this.initBuffers();
}

initBuffers()
{
	this.vertices = [];
	this.indices = [];
    this.normals = [];
    this.texCoords = [];

 	this.ang = Math.PI*2/this.slices;

 	this.vertices.push(0, 0, 0);
 	this.normals.push(0, 0, 1);
 	this.texCoords.push(0.5, 0.5);

    for(var i=0; i< this.slices; i++){
    	this.vertices.push(this.radius*Math.cos(this.ang*i), this.radius*Math.sin(this.ang*i), 0);
    	this.normals.push(0, 0, 1);
    	this.texCoords.push((Math.cos(-this.ang*i)+1)/2, (Math.sin(-this.ang*i)+1)/2);
    }

    for(i=1; i<= this.slices; i++){
    	this.indices.push(i, i%this.slices+1, 0);
    }

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

};
