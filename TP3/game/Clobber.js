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
    };

    this.mode ={
      PLAYER_VS_PLAYER:1,
      PLAYER_VS_BOT:2,
      BOT_VS_PLAYER:3,
      BOT_VS_BOT:4,
    };
    this.moves=[];
    this.currentMove=0;
    this.player=1;

    this.currentState = this.state.WAITING;
    this.previousState=this.state.WAITING;
    this.board=[];
    this.newBoard=[];
    this.pieceToMove;
    this.newPiece;

  }

  startGame(mode,level){

      if(this.currentState==this.state.WAITING){

        switch (gameMode) {
          case "Player vs Player":
            this.gameMode = this.mode.PLAYER_VS_PLAYER;
            break;
          case "Player vs Bot":
            this.gameMode = this.mode.PLAYER_VS_BOT;
            break;
          case "Bot vs Player":
            this.gameMode = this.mode.BOT_VS_PLAYER;
            break;
          case "Bot vs Bot":
            this.gameMode = this.mode.BOT_VS_BOT;
            break;
          default:
            break;
        }
    
        switch (gameLevel) {
          case "Rookie":
            this.gameLevel = 0;
            break;
          case "Pro":
            this.gameLevel = 1;
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
      }
  
    getInitialBoard(){
      let game=this;
      this.scene.client.getPrologRequest('initialBoard',function(data){
        game.board=game.parseBoard(data.target.response);
        game.scene.isReady=1;  
      game.currentState=game.state.CHOOSING_PIECE_TO_MOVE;
        console.log(game.board);
      },function(data){
        console.log('connection error');
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
      this.newPiece=piece;
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
          game.newPiece.isSelected=false;      
        }
        else{
        let move = new Move(game.pieceToMove,[row,column],game.player);
        game.moves.push(move);
        game.currentState=game.state.ANIMATION;
        game.pieceToMove[2].animating=true;
        game.pieceToMove[2].animation.direction=game.calculateDirection(game.pieceToMove[0],game.pieceToMove[1],row,column);
        
      }
       
       
      },function(data){
        console.log('connection error');
      });

    }

    changePlayer(){
      if (this.player==1)
          this.player=2;
      else this.player=1;
      console.log("It's time for player "+ this.player);
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
  game.newPiece.isSelected=false;
  
  game.board = game.newBoard;
  game.gameOver();

 
 

}


gameOver(){

  let game=this;
  let board= game.parseBoardProlog();
  var command="game_over("+board+","+this.player+")";
    
  this.scene.client.getPrologRequest(command,function(data){
    let answer=data.target.response;
    console.log(answer);
    if (answer==1){
   game.currentState = game.state.GAME_OVER;
   console.log('GAME OVER',answer);
    }
    else  {
      game.changePlayer();
      game.currentState=game.state.CHOOSING_PIECE_TO_MOVE;  
    }
   
  },function(data){
    console.log('connection error');
  });

  
}


}


