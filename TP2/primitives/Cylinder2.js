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
        this.degree1 = this.slices - 1;
        this.degree2 = this.stacks - 1;

    this.controlPoints=this.parseControlPoints([
                                                [this.base/2,0.0,this.height/2, 0.707],
                                                [-this.base/2,0.0,this.height/2,0.707],
                                                [this.base/2,this.base /2 * Math.sin((180-45)*Math.PI/180),this.height/2,0.707], 
                                                
                                                [-this.base,this.base /2 * Math.sin(45*Math.PI/180),this.height/2,0.707],
            
                                                
                                                
                                                
                                                
                                                
                         ],this.slices,this.stacks);

    this.nurbsSurface = new CGFnurbsSurface(this.degree1,this.degree2, this.controlPoints);
    this.nurbsObject = new CGFnurbsObject(this.scene, this.slices, this.stacks, this.nurbsSurface);

};

display(){
    this.scene.pushMatrix();
    this.nurbsObject.display();
    this.scene.popMatrix();

  }
updateTexCoords (s,t) {
    this.updateTexCoordsGLBuffers();
};

parseControlPoints(controlPoints, npointsU, npointsV){
    var nPoints = npointsU * npointsV;
    var cPoints = [];
    var loop = controlPoints.length / npointsV;
    var counter= 1;
    var j = 0;
    while(counter <= loop){
      var aux = [];
      for(var i = j; i < (npointsV*counter); i++){

          var point = vec4.create();
          var x , y , z, w;
          x = controlPoints[i][0];
          y = controlPoints[i][1];
          z = controlPoints[i][2];
          w = controlPoints[i][3];
          vec4.set(point,x,y,z,w);
          aux.push(point);
          j++;
      }
      cPoints.push(aux);
      counter++;
    }
    return cPoints;
  }

}