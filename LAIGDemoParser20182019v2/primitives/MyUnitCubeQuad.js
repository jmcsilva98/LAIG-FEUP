class MyUnitCubeQuad extends CGFobject 
{
	constructor(scene, minS, maxS, minT, maxT) 
	{
		super(scene);
		this.quad = new MyQuad (this.scene, minS, maxS, minT, maxT);
		this.quad.initBuffers();
	};
    
    display()
    {
    	this.scene.pushMatrix(); 
        this.quad.display();
      	this.scene.rotate(90 * Math.PI/180.0,0,1,0);
      	this.quad.display();
      	this.scene.rotate(90 * Math.PI/180.0,0,1,0);
      	this.quad.display();
      	this.scene.rotate(90 * Math.PI/180.0,0,1,0);
      	this.quad.display();
      	this.scene.rotate(90 * Math.PI/180.0,0,1,0);
      	this.quad.display();
      	this.scene.popMatrix();

      	this.scene.pushMatrix(); 
     	this.scene.rotate(90 * Math.PI/180.0,1,0,0);
      	this.quad.display();
	    this.scene.rotate(180 * Math.PI/180.0,1,0,0);
      	this.quad.display();
      	this.scene.popMatrix();
    };
};