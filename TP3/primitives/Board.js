class Board extends  CGFobject {
	constructor(scene,dimX,dimZ){
    super(scene);
    this.dimX=dimX;
    this.dimZ=dimZ;
    this.cells=[];
    this.pieces=[];
    
    this.white = new CGFappearance(this.scene);
    this.white.setAmbient(1.0,1,1,1);
    this.white.setDiffuse(1.0,1,1,1);
    this.white.setSpecular(1.0,1,1,1);
    this.white.setShininess(0);
    this.white.loadTexture("images/white.jpg");
    this.black = new CGFappearance(this.scene);
    this.black.setAmbient(1.0,1,1,1);
    this.black.setDiffuse(1.0,1,1,1);
    this.black.setSpecular(1.0,1,1,1);
    this.black.setShininess(0);
    this.black.loadTexture("images/black.jpg");
    this.distanceBetweenCells=1.2;

    this.createBoard();
};


createBoard(){
    let i, j;
    let line=[];
    let pieceLine=[];
    for(i = 0; i < this.dimZ ; i++){
        for(j = 0; j < this.dimX; j++){
            line[j]=new Cube(this.scene,j,i);
            pieceLine[j]=new Piece(this.scene,j,i);
        }
        this.cells[i]=line;
        this.pieces[i]=pieceLine;
        line=[];
        pieceLine=[];
    }
};

display(){
let i,j;
let zDistance=0;
 for ( i = 0;i < this.dimZ;i++){
    for (j = 0; j < this.dimX;j++){
        this.scene.pushMatrix();
        this.scene.translate(j*this.distanceBetweenCells,0,i+zDistance);
        if ((j+i)%2==0){
            this.black.apply();
        }
        else this.white.apply();
        this.scene.scale(1, 0.25, 1);
       this.cells[j][i].display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(j*this.distanceBetweenCells,0,i+zDistance);
        if ((j+i)%2==0){
            this.white.apply();
        }
        else this.black.apply();
        this.pieces[j][i].display();
        this.scene.popMatrix();
    }
    zDistance+=0.2;
}
};

updateTexCoords(length_s,length_t)
{
	
}
};