class MyPiece extends  CGFobject {

constructor(scene, xPosition,zPosition,type){
    super(scene);
    this.xPosition=xPosition;
    this.zPosition=zPosition;
  
    if(this.scene.graph.rootName == 'relaxing')
      this.piece=new MyCylinder(this.scene,1,1,1,20,8);
    else {
      this.piece=new MyCylinder(this.scene,1,1,1,6,8);
    }
    this.isSelected=false;
    this.animationMatrix=mat4.create();
    this.center= vec3.create(xPosition,0,zPosition);
    this.direction=0;
    this.time=0;
    this.type=type;
    this.animating=false;
    this.animation= new PieceAnimation(this.scene,this.center,180,this.direction);


}
display(material){

    if (this.animating){
        if (this.animation.endOfAnimation){
             this.animating=false;
             this.time=0;
             this.scene.game.endAnimation();
        }
        else{
        this.animation.update(this.time);
        this.time+=0.5;
        this.animationMatrix=this.animation.apply();
        }
    }

    this.scene.pushMatrix();
    this.scene.translate(0.4,0.5,0);
    this.scene.scale(0.4,0.25,0.4);
    this.scene.rotate(Math.PI/2,1,0,0);
    this.scene.multMatrix(this.animationMatrix);
    material.apply();
    this.piece.display();
    this.scene.popMatrix();
}

updateTexCoords (s, t) {

};

}
