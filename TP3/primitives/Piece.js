class Piece extends  CGFobject {

constructor(scene, xPosition,zPosition){
    super(scene);
    this.xPosition=xPosition;
    this.zPosition=zPosition;
    this.piece=new MyCylinder(this.scene,1,1,1,20,8);
}
display(){
    this.scene.pushMatrix();
    this.scene.translate(0.4,0.5,0);
    this.scene.scale(0.4,0.25,0.4);
    this.scene.rotate(Math.PI/2,1,0,0);
    this.piece.display();
    this.scene.popMatrix();
}

updateTexCoords (s, t) {

};
}