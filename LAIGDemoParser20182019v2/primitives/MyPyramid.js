/** 
 * MyPyramid
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPyramid extends CGFobject
{ 
	constructor(scene, minS, maxS, minT, maxT) 
	{
		super(scene);
        this.quad = new MyQuad (this.scene, minS, maxS, minT, maxT);
		this.triangle = new MyTriangle (this.scene, minS, maxS, minT, maxT);
		this.quad.initBuffers();
	};

	display() 
	{
	  	this.scene.pushMatrix(); 
	  	this.scene.translate (0,0.5,0);
	  	this.scene.rotate (180 * Math.PI/180, 0, 1, 0);
		this.quad.display();
		this.scene.popMatrix(); 

        this.scene.pushMatrix(); 
        this.scene.translate (0,0.5,0);
	  	this.scene.rotate (90 * Math.PI/180 ,1, 0,0);
		this.quad.display();
		this.scene.popMatrix(); 

		this.scene.pushMatrix(); 
	    this.scene.translate (0,0.15,-0.35);
        this.scene.rotate (-45 * Math.PI/180, 1, 0, 0);
        this.scene.scale (1, Math.sqrt (2),1);
		this.quad.display();
		this.scene.popMatrix(); 

		this.scene.pushMatrix(); 
        this.scene.translate (0.5,0,-0.5);
        this.triangle.display();
		this.scene.popMatrix(); 

	    this.scene.pushMatrix(); 
        this.scene.translate (-0.5,0,-0.5);
        this.triangle.display();
		this.scene.popMatrix(); 
	};

};
