class Cylinder2 extends  CGFobject {
	constructor(scene,graph, base, top, height, slices, stacks){
    super(scene)
    this.slices = slices;
    this.stacks = stacks;
    this.height = height;
    this.base = base;
    this.top = top;
    this.graph= graph;

    this.initBuffers();
};



	initBuffers () {
        this.degree1 = 3;
        this.degree2 = 1;

    this.controlPoints= [
        
        
        [[-this.base,0.0,this.height/2, 1],
        [-this.top,0.0,-this.height/2,1]],
        
        [[-this.base,this.base+0.5,this.height/2,0.707],
        [-this.top,this.top+0.5,-this.height/2,0.707]],
        
        [[this.base,this.base+0.5,this.height/2, 0.707],
        [this.top,this.top+0.5,-this.height/2,0.707]],
        
        [[this.base,0,this.height/2, 1],
        [this.top,0,-this.height/2,1]]  
                                                                         
    ];

    this.nurbsSurface = new CGFnurbsSurface(this.degree1,this.degree2, this.controlPoints);
    this.nurbsObject = new CGFnurbsObject(this.scene, this.slices, this.stacks, this.nurbsSurface);

};

display(){
    this.scene.pushMatrix();
    this.nurbsObject.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI,0,0,1);
    this.nurbsObject.display();
    this.scene.popMatrix();

  }
updateTexCoords (s,t) {
    this.updateTexCoordsGLBuffers();
};
}