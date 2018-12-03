/**
 * Cube constructor
 * @param scene CGFscene where the component will be displayed
 * @param posZ cube z position
 * @param posX cube x position
 */
class Cube extends CGFobject{
   constructor(scene,posX, posZ){
    super(scene);
    this.scene = scene;
    this.posX = posX;
    this.posZ = posZ;

    this.quad = new MyQuad(this.scene,-0.5,0.5,-0.5,0.5);
    
   }
display (){

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2,1,0,0);
    this.scene.translate(0.5,0,0);
    this.quad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.5,1,0);
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.quad.display();
    this.scene.popMatrix(); 

    this.scene.pushMatrix();
    this.scene.translate(0.5,0.5,-0.5);
    this.scene.rotate(Math.PI,0,1,0);
    this.quad.display();
    this.scene.popMatrix();

     this.scene.pushMatrix();
    this.scene.translate(0,0.5,0);
    this.scene.rotate(-Math.PI/2,0,1,0);
    this.quad.display();
    this.scene.popMatrix(); 

    this.scene.pushMatrix();
    this.scene.translate(1,0.5,0);
    this.scene.rotate(Math.PI/2,0,1,0); 
    this.quad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.5,0.5,0.5);
    this.quad.display();
    this.scene.popMatrix(); 


};

updateTexCoords (s, t) {

};
};