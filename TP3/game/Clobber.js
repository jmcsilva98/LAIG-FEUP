class Clobber {

  constructor(scene){
    this.scene=scene;
    this.whitePlayer=new Player(this.scene,1);
    this.blackPlayer=new Player(this.scene,2);

    this.state= {
      WAITING:0,
      CHOOSING_PIECE_TO_MOVE: 1,
      CHOOSING_NEW_CELL: 2,
      ANIMATION:3,
      MOVE:4,
      DRAW_GAME:5,
      GAME_OVER:6,
      EXIT_GAME:7,
      MOVIE:8,
      ERROR:9,
      GAME_WON:11,
    };

    this.mode ={
      PLAYER_VS_PLAYER:1,
      PLAYER_VS_BOT:2,
      BOT_VS_BOT:3,
    };
    this.moves=[];
    this.currentMove=0;
    this.player=1;

    this.currentState = this.state.WAITING;
    this.previousState=this.state.WAITING;
    this.board=[];
    this.newBoard=[];
    this.pieceToMove;
    this.nextPiece;

    this.selectedMaterialWhite = new CGFappearance(this.scene);
    this.selectedMaterialWhite.setAmbient(1,0.71,0.76,1);
    this.selectedMaterialWhite.setDiffuse(1,0,0,1);
    this.selectedMaterialWhite.setSpecular(1,0,0,1);
    this.selectedMaterialWhite.setShininess(0);
    this.selectedMaterialWhite.loadTexture("images/white.jpg");

  //  this.scene.info = "Please choose a Game Mode and Difficulty. Then press Start Game to play."
    this.scene.error = "";
  }

  startGame(mode,level){

      if(this.currentState==this.state.WAITING){
        console.log(mode);
        switch (mode) {
          case "Player vs Player":
            this.gameMode = this.mode.PLAYER_VS_PLAYER;
            break;
          case "Player vs Bot":
            this.gameMode = this.mode.PLAYER_VS_BOT;
            break;
          case "Bot vs Bot":
            this.gameMode = this.mode.BOT_VS_BOT;
            break;
          default:
            break;
        }

        switch (level) {
          case "Rookie":
            this.gameLevel = 1;
            break;
          case "Pro":
            this.gameLevel = 2;
            break;
          default:
            break;
        }
        this.initializeVariables();
      }
    }

      initializeVariables(){
        this.moves=[];
        this.player=1;
        this.previousPlayer=this.player;
        this.currentState=this.state.CHOOSING_PIECE_TO_MOVE;
        console.log(this.gameMode)
       if (this.gameMode==this.mode.BOT_VS_BOT){
          console.log('gameMode');
          this.executeMoveBot();
        }

      }

    getInitialBoard(){
      let game=this;
      this.scene.client.getPrologRequest('initialBoard',function(data){
        game.board=game.parseBoard(data.target.response);
        game.scene.isReady=1;
      },function(data){
        console.log('connection error');
        //this.scene.error("Connection Error: " + data.target.response);
      });
      }

      parseBoard(board){

        let parsedBoard=[];
        let row,column,i;
        let line;
        i=0;

        for (column = 0;column < 8;column++){
            line=[];
            row=0;
            while(row !=8){
              if (!(board[i] =='[' || board[i] ==',' || board[i] == ']')){
              line.push(board[i]);
              row++;
            }
            i++;
            }
            parsedBoard.push(line);
        }

     return parsedBoard;

      }
 parseBoardProlog(){
      var boardString = "";
      boardString = boardString + "[";

      for (let i = 0; i < this.board.length; i++) {
        boardString = boardString + "[";

        for (let j = 0; j < this.board[i].length; j++) {
          let element;
          switch (this.board[i][j]) {
            case "0":
              element = "empty";
              break;
            case "1":
              element = "white";
              break;
            case "2":
              element = "black";
              break;
            default:
              break;
          }
          boardString = boardString + element;
          if (j != this.board[i].length - 1) boardString = boardString + ",";
        }

        boardString = boardString + "]";
        if (i != this.board.length - 1) boardString = boardString + ",";
      }

      boardString = boardString + "]";

      return boardString;
    }


      getBoard(){
        return this.board;
      }

    selectedPiece(row,column,piece){
      piece.isSelected=true;
      this.nextPiece=piece;
      this.previousState=this.currentState;
      switch(this.currentState){
        case this.state.CHOOSING_PIECE_TO_MOVE:
        this.saveFirstPosition(row,column,piece);
        this.currentState= this.state.CHOOSING_NEW_CELL;
        break;
        case this.state.CHOOSING_NEW_CELL:
        this.direction=this.calculateDirection(this.pieceToMove[0],this.pieceToMove[1],row,column);
        this.executeMove(row,column);
        break;
        default:

      }
    }

    saveFirstPosition(row,column,piece){
      this.pieceToMove=[row,column,piece];
    }


    executeMove(row,column){
      let game=this;
      let board= game.parseBoardProlog();
      var command="validate_move("+this.pieceToMove[0]+","+row+","+this.pieceToMove[1]+","+column+","+this.player+","+board+",0)";

      this.scene.client.getPrologRequest(command,function(data){
        let lastBoard = game.board;
        game.newBoard =game.parseBoard(data.target.response);
        let boardsAreEqual= game.arraysAreIdentical(lastBoard,game.newBoard);

        if(boardsAreEqual){
          game.pieceToMove[2].isSelected=false;
          game.currentState=game.state.CHOOSING_PIECE_TO_MOVE;
          game.nextPiece.isSelected=false;
        }
        else{
        let move = new Move(game.pieceToMove,[row,column],lastBoard,game.player);
        game.moves.push(move);
        game.currentState=game.state.ANIMATION;
        game.pieceToMove[2].animating=true;
        game.pieceToMove[2].animation.direction=game.calculateDirection(game.pieceToMove[0],game.pieceToMove[1],row,column);

      }


      },function(data){
        console.log('connection error');
        this.scene.error = "Error: " + data.target.response;
      });


    }

    executeMoveBot(){
      let game=this;
      let board= game.parseBoardProlog();

      var command="bot_move("+board+","+game.player+","+game.gameLevel+")";

      this.scene.client.getPrologRequest(command,function(data){
        let lastBoard = game.board;
        game.newBoard =game.parseBoard(data.target.response);
        let newMove= game.findMovement(lastBoard,game.newBoard);

        let firstPiece = game.scene.board.pieces[newMove[0][0]][newMove[0][1]];
        game.pieceToMove[2]=firstPiece;
        game.pieceToMove[2].isSelected=true;
        let secondPiece = game.scene.board.pieces[newMove[1][0]][newMove[1][1]];
        game.nextPiece=secondPiece;
        game.nextPiece.isSelected=true;
        let move = new Move(firstPiece,secondPiece,lastBoard,game.player);
        game.moves.push(move);
        game.currentState=game.state.ANIMATION;
       game.pieceToMove[2].animating=true;
       game.pieceToMove[2].animation.direction=game.calculateDirection(newMove[0][0],newMove[0][1],newMove[1][0],newMove[1][1]);

        console.log(newMove[0],firstPiece);

      },function(data){
        console.log('connection error');
      });


    }

    changePlayer(){
      if (this.player==1)
          this.player=2;
          //mudar a camera
          //set do tempo
      else this.player=1;
      console.log("It's time for player "+ this.player);
    }

    updatePlayerScore(){
      switch (this.player) {
        case 1:
          this.whitePlayer.incrementScore();
          break;
        case 2:
          this.blacklayer.incrementScore();
          break;
        default:

      }
    }

    checkState(){

    switch (this.currentState) {
      case this.state.EXIT_GAME:
        this.scene.info = "Leaving the game.";
        this.currentState = this.state.WAITING;
        break;
      case this.state.WAITING:
        this.scene.info = "Waiting for play. A piece can only move to an adjacent (horizontal and vertical) cell that contains a piece of the other player";
      break;
      case this.state.CHOOSING_PIECE_TO_MOVE:
        this.scene.info = "Select the piece you want to move.";
      break;
      case this.state.CHOOSING_NEW_CELL:
        this.scene.info = "Select the cell you wish to move to. Only an adjacent cell with an opposite piece";
      break;
      case this.state.ANIMATION:
        this.scene.info = "Moving piece";
      break;
      case this.state.MOVE:
        this.scene.info = "Moving piece";
      break;
      case this.state.DRAW_GAME:
        this.scene.info = "The game was a draw...";
      break;
      case this.state.GAME_OVER:
        this.scene.info = "Game Over!!";
      break;
      case this.state.GAME_WON:
        this.scene.info = "Game Won!!";
      break;
      default:

    }
    }


    calculateDirection(row,column,newRow,newColumn){

      if (column==newColumn){
        if (row < newRow)
        return Math.PI;
        else return 0;
      }
      else if (column < newColumn)
          return Math.PI/2;
      else return -Math.PI/2;

    }

    arraysAreIdentical(arr1, arr2){
      if (arr1.length !== arr2.length) return false;
      for (var i = 0, len = arr1.length; i < len; i++){
        for (var j =0,len1 =arr2.length;j<len1;j++){
          if (arr1[i][j] !== arr2[i][j]){
              return false;
          }
        }
      }
      return true;
  }

endAnimation(){
  let game = this;
  game.pieceToMove[2].isSelected=false;
  game.nextPiece.isSelected=false;
  game.board = game.newBoard;
  game.currentState=game.state.CHOOSING_PIECE_TO_MOVE;
  game.gameOver();


}

    quitGame() {
      if(this.currentState != this.state.MOVIE && this.currentState != this.state.WAITING){
        this.currentState = this.state.EXIT_GAME;

      }
    }

gameOver(){

  let game=this;
  let board= game.parseBoardProlog();
  var command="game_over("+board+","+this.player+")";

  this.scene.client.getPrologRequest(command,function(data){
    let answer=data.target.response;
    if (answer==1){
   game.currentState = game.state.GAME_OVER;
   console.log('MOVES',game.moves);

    }
    else  {
      game.changePlayer();
      game.currentState=game.state.CHOOSING_PIECE_TO_MOVE;
      if(game.gameMode == 3 || (game.gameMode ==2 && game.player==2)){
        game.executeMoveBot();
      }
    }



  },function(data){
    console.log('connection error');
  });
}

findMovement(arr1,arr2){
let firstPosition,secondPosition;
  if (arr1.length !== arr2.length) return false;
  for (var i = 0, len = arr1.length; i < len; i++){
    for (var j =0,len1 =arr2.length;j<len1;j++){
      if (arr1[i][j] !== arr2[i][j] && arr2[i][j] == 0){
        firstPosition=[i,j];
        this.saveFirstPosition(i,j,null);
      }
      else if (arr1[i][j] !== arr2[i][j])
      secondPosition=[i,j];
    }
  }
  return [firstPosition,secondPosition];

}
undo(){
  let game = this;
  console.log(game.board)
  game.board = this.moves[this.moves.length-1].lastBoard;
  //console.log(game.board);
  game.player = this.moves[this.moves.length-1].player;
  game.currentState=game.state.CHOOSING_PIECE_TO_MOVE;
}


}
