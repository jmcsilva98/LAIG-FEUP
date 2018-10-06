

class MyDisc extends CGFobject
{
    constructor (scene,slices)
    {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    }

    initBuffers()
    {
        this.vertices=[];
        this.normals=[];
        this.indices=[];
        this.texCoords=[];

 	  var angle = 2*Math.PI/this.slices;


        this.vertices.push(0,0,1);
        this.normals.push (0,0,1);
        this.texCoords.push(0.5,0.5)

        for (var i = 0; i < this.slices; i++)
        {
	    	this.vertices.push(Math.cos(i*angle), Math.sin(i*angle), 1);
	    	this.normals.push (0,0,1);
      		this.texCoords.push(Math.cos(i*angle)/2 + 0.5, 1- (Math.sin(i*angle)/2 + 0.5));


	    	this.indices.push (0,i,i+1);
        }

        this.vertices.push(1,0,0);
	   this.normals.push(0, 0, 1);
	   this.indices.push (0,this.slices,1);
        	this.texCoords.push(1, 0.5);

	//this.primitiveType=this.scene.gl.TRIANGLES;

	   this.initGLBuffers();

    }
    

}