/**
 * MyTrapezium
 * @constructor
 */

class MyTrapezium extends CGFobject 
{
	constructor(scene, minS, maxS, minT, maxT) 
	{
		super(scene);
		this.cube = new MyUnitCubeQuad (this.scene, minS, maxS, minT, maxT);
		this.pyramid = new MyPyramid (this.scene, minS, maxS, minT, maxT);
		this.pyramid.initBuffers();
		this.cube.initBuffers();
	};
    
    display()
    {
    	this.scene.pushMatrix(); 
    	this.scene.scale (1, 0.2, 1);
        this.cube.display();
        this.scene.popMatrix(); 

        this.scene.pushMatrix(); 
        this.scene.translate (0, 0.1, 0);
        this.pyramid.display();
		this.scene.popMatrix(); 
    };
};
