/**
 * MyPlane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPlane extends CGFobject{
    constructor(scene, npartsU, npartsV) {

    super(scene);
    this.npartsU = npartsU;
    this.npartsV = npartsV;

  //pontos de controlo centrado em 0, quadrado unitario

    this.plane = this.makePlane();
    }

    makePlane(){

      var controlvertexes = 	[ [
                                  [-0.5,0,0.5,1],
                                  [-0.5,0,-0.5,1]],
                                [
                                  [0.5,0,0.5,1],
                                  [0.5,0,-0.5,1]]];

      var nurbsSurface = new CGFnurbsSurface(1, 1, controlvertexes);
      var nurbsObject =  new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface );

      return nurbsObject;
    };

    display(){
      this.scene.pushMatrix();
      this.plane.display();
      this.scene.popMatrix();
    }

    updateTexCoords(length_s,length_t){
    }

  };
