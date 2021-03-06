class Board extends  CGFobject {
	constructor(scene,dimX,dimZ){
    super(scene);
    this.dimX=dimX;
    this.dimZ=dimZ;
    this.cells=[];
    this.pieces=[];
    this.piecesThatLeftWhite=[];
    this.piecesThatLeftBlack=[];
    this.whitePiecesLeft=0;
    this.blackPiecesLeft=0;


    this.cellAppearance= new CGFappearance(this.scene);
		if(this.scene.graph.rootName == "relaxing"){
    this.cellAppearance.setAmbient(0.3,0.3,0.3,1);
    this.cellAppearance.setDiffuse(0.5,0.5,0.5,1);
    this.cellAppearance.setSpecular(0.8,0.8,0.8,1);
		    this.cellAppearance.loadTexture("images/base.jpg");
	}else{
		this.cellAppearance.setAmbient(0.2,0.2,0.2,1);
		this.cellAppearance.setDiffuse(0.3,0.3,0.3,1);
		this.cellAppearance.setSpecular(0.1,0.1,0.1,1);
		this.cellAppearance.loadTexture("images/table.jpg");
	}
    this.cellAppearance.setShininess(0);



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

    this.selectedMaterialWhite = new CGFappearance(this.scene);
    this.selectedMaterialWhite.setAmbient(1,0.71,0.76,1);
    this.selectedMaterialWhite.setDiffuse(1,0,0,1);
    this.selectedMaterialWhite.setSpecular(1,0,0,1);
    this.selectedMaterialWhite.setShininess(0);
    this.selectedMaterialWhite.loadTexture("images/white.jpg");

    this.selectedMaterialBlack = new CGFappearance(this.scene);
    this.selectedMaterialBlack.setAmbient(1,0.13,0.13,1);
    this.selectedMaterialBlack.setDiffuse(1,0,0,1);
    this.selectedMaterialBlack.setSpecular(1,0,0,1);
    this.selectedMaterialBlack.setShininess(0);
    this.selectedMaterialBlack.loadTexture("images/white.jpg");
    this.distanceBetweenCells=1.2;
    this.createBoard();
    console.log(this.pieces);

};


createBoard(){
    let i, j;
    let line=[];
    let pieceLine=[];
    let position=0;
    for(i = 0; i < this.dimZ ; i++){
        for(j = 0; j < this.dimX; j++){
            if ((i+j)%2==0)
            position="2";
            else position="1";
            line[j]=new Cube(this.scene,j,i);
            pieceLine[j]=new MyPiece(this.scene,j,i,position);
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
let id =1;
let material;
 for (i = 0;i < this.dimZ;i++){
    for (j = 0; j < this.dimX;j++){
        this.scene.pushMatrix();
        this.scene.translate(j*this.distanceBetweenCells,0,i+zDistance);
        this.cellAppearance.apply();
        this.scene.scale(1, 0.25, 1);
        this.cells[j][i].display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(j*this.distanceBetweenCells,0,i+zDistance);

        this.scene.registerForPick(id, this.pieces[i][j]);

        id+=1;
        if(this.scene.game.board[i][j] != 0){
        if(!this.pieces[i][j].isSelected){
        if (this.scene.game.board[i][j]=="2"){
            material=this.black;
        }
        else material=this.white;

    }
    else if(this.scene.game.board[i][j]=="2")
        material=this.selectedMaterialBlack;
    else{
     material=this.selectedMaterialWhite;
    }
        this.pieces[i][j].display(material);
}
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
    }
    zDistance+=0.2;

}
 j =0;
 this.dividePieces();

for (let i =0;i<this.piecesThatLeftBlack.length;i++){
    if(i%2 ==0) j++;
    this.scene.pushMatrix();
    this.scene.translate(11.5+i%2,0,-2+2.2*j/2);
    material =this.black;
    this.piecesThatLeftBlack[i].display(material);
    this.scene.popMatrix();

}
j=0;
for (let i =0;i<this.piecesThatLeftWhite.length;i++){
    if(i%2 ==0) j++;
    this.scene.pushMatrix();
    this.scene.translate(-3-i%2,0,10.5-2.2*j/2);
     material =this.white;
    this.piecesThatLeftWhite[i].display(material);
    this.scene.popMatrix();

}


};
dividePieces(){
    this.piecesThatLeftBlack=[];
    this.piecesThatLeftWhite=[];
    let piece = new MyPiece(this.scene,0,0,0);
    let i = 0;
    while(i < this.whitePiecesLeft){
        this.piecesThatLeftWhite.push(piece);
        i++;
    }
    i=0;
    while(i < this.blackPiecesLeft){
        this.piecesThatLeftBlack.push(piece);
        i++;
    }

}

updateTexCoords(length_s,length_t)
{

}
};
