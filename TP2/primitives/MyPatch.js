/**
 * MyPatch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class MyPatch extends CGFobject
{
  constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints){

  super(scene);
  this.npointsU = npointsU;
  this.npointsV = npointsV;
  this.npartsU = npartsU;
  this.npartsV = npartsV;
  this.controlPoints = controlPoints;

  this.degree1 = npointsU-1;
  this.degree2 = npointsV-1;

  this.nurbsSurface = new CGFnurbsSurface(this.degree1,this.degree2, this.controlPoints);
  this.nurbsObject = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface);

};


display(){
  this.nurbsObject.display();
}

updateTexCoords(length_s,length_t){
}


};
