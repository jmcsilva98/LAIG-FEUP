/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks)
   {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;
		this.height = height;

		this.tube =  new MyOpenCylinder(scene, base, top, height, slices, stacks);
		this.base = new MyPolygon(scene, slices, base);
		this.top = new MyPolygon(scene, slices, top);

		this.initBuffers();

	};
	display()
	{
		this.scene.pushMatrix();
		this.scene.scale(1,1,this.height);
    	this.tube.display();
        this.scene.popMatrix();

  		this.scene.pushMatrix();
         this.scene.rotate(Math.PI, 0, 1, 0);
         this.base.display();
     	this.scene.popMatrix();

     this.scene.pushMatrix();
         this.scene.translate(0, 0,this.height);
         this.top.display();
	 this.scene.popMatrix();


};
updateTexCoords(length_s,length_t)
{
	
}
};
