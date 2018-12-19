next_player(1,2).
next_player(2,1).
player_piece(1,'white').
player_piece(2,'black').

/*Função para substituir um valor numa lista. */
replace_in_list([_H|T],0,Value,[Value|T]).

replace_in_list([H|T],Column,Value,[H|T1]):-
    Column > -1,
    NewColumn is Column - 1,
    replace_in_list(T,NewColumn,Value,T1).
/*Função para substituir um valor numa matriz(lista de listas). */
replace_in_matrix([H|T],0,Column,Value,[H1|T]):-
    replace_in_list(H,Column,Value,H1).

replace_in_matrix([H|T],Row,Column,Value,[H|T1]) :-
    Row > -1,
    NewRow is Row - 1,
    replace_in_matrix(T,NewRow,Column,Value,T1).

/*Função para obter um valor de uma lista*/    
get_value_from_list([H|_T],0,Value):-
        Value= H.


get_value_from_list([_H|T],Column,Value):-
        Column > -1,
        NewColumn is Column - 1,
        get_value_from_list(T,NewColumn,Value).

/*Função para obter um valor de uma matriz(lista de listas)*/
get_value_from_matrix([H|_T],0,Column,Value):-
    get_value_from_list(H,Column,Value).

get_value_from_matrix([_H|T],Row,Column,Value):-
    Row > -1,
    Row < 8,
    NewRow is Row - 1,
    get_value_from_matrix(T,NewRow,Column,Value).
/*percorrer o tabuleiro e a peça encontrada em (X,Y) não é a peça do jogador em questão (Piece1),
 portanto não se faz as verificações*/
value([H|T],Piece1,Piece2,X,Y):-
                                get_value_from_matrix([H|T],X,Y,Value),
                                Value \= Piece1.
                           
value([H|T],Piece1,Piece2,X,Y):-  
                                X1 is X-1,
                                X2 is X+1,
                                Y1 is Y-1,
                                Y2 is Y+1,
                                get_value_from_matrix([H|T],X,Y,Value),
                                Value == Piece1,!,                         
                                (\+(get_value_from_matrix([H|T],X1,Y,Piece2))),!,
                                (\+(get_value_from_matrix([H|T],X2,Y,Piece2))),!,                               
                                (\+(get_value_from_matrix([H|T],X,Y1,Piece2))),!,
                                (\+(get_value_from_matrix([H|T],X,Y2,Piece2))).

/*quando chega ao final da linha tem que passar para a linha seguinte e a coluna volta a 0*/
game_over(Board,X,7,Player):- 
                            X1 is X+1,
                            Y is 0,
                            game_over(Board,X1,Y,Player).
/*quando chega ao final do tabuleiro*/
game_over(Board,7,7,Player).
/*verificar se jogador(Player) ganhou*/
game_over(Board, X,Y,Player):-
    player_piece(Player,Piece),
    next_player(Player,NextPlayer),
    player_piece(NextPlayer,Piece2),
    value(Board,Piece,Piece2,X,Y),
    Y1 is Y+1,
    game_over(Board,X,Y1,Player).
 
/*Predicado que verifica se o jogador detentor das peças Piece1 na posição (X,Y)
 tem uma jogada possível para a célula imediatamente acima. Se for, atualiza a lista de jogadas possíveis e incrementa o número das mesmas*/     
verify_up_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):-  
                                                                    get_value_from_matrix([H|T],X,Y,Value),
                                                                    Value \= Piece1,
                                                                    ActualNumber is Number,
                                                                    UpdatedList=ActualList.
                                                                    
     verify_up_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):-
                                                X1 is X-1,
                                                get_value_from_matrix([H|T],X,Y,Piece1),                                                           
                                                get_value_from_matrix([H|T],X1,Y,Piece2),                                                
                                                ActualNumber is Number + 1,
                                                append(ActualList,[[X,Y,X1,Y]],UpdatedList).
    
    verify_up_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):- 
                                                                        ActualNumber is Number,
                                                                        UpdatedList=ActualList.
                                                                            
/*Predicado que  verifica se o jogador detentor das peças Piece1 na posição (X,Y)
 tem uma jogada possível para a célula imediatamente abaixo. Se for, atualiza a lista de jogadas possíveis e incrementa o número das mesmas*/ 
     verify_down_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):-  
                                                                    get_value_from_matrix([H|T],X,Y,Value),
                                                                    Value \= Piece1,
                                                                    ActualNumber is Number,
                                                                    UpdatedList=ActualList.
                                                                    
     verify_down_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):-
                                                X1 is X+1,
                                                get_value_from_matrix([H|T],X,Y,Piece1),                                                           
                                                get_value_from_matrix([H|T],X1,Y,Piece2),                                                
                                                ActualNumber is Number + 1,
                                                append(ActualList,[[X,Y,X1,Y]],UpdatedList).
    verify_down_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):- 
                                                                        ActualNumber is Number,
                                                                        UpdatedList=ActualList.
  /*Predicado que verifica se o jogador detentor das peças Piece1 na posição (X,Y)
 tem uma jogada possível para a célula imediatamente à esquerda. Se for, atualiza a lista de jogadas possíveis e incrementa o número das mesmas*/                                                                         
    
    verify_left_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):-  
                                                                    
                                                                    get_value_from_matrix([H|T],X,Y,Value),
                                                                    Value \= Piece1,
                                                                    ActualNumber is Number,
                                                                    UpdatedList=ActualList.
                                                                    
verify_left_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):-
                                                Y1 is Y-1,
                                                get_value_from_matrix([H|T],X,Y,Piece1),                                                           
                                                get_value_from_matrix([H|T],X,Y1,Piece2),                                                
                                                ActualNumber is Number + 1,
                                                append(ActualList,[[X,Y,X,Y1]],UpdatedList).
    
    

verify_left_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):- 
                                                                        
                                                                        ActualNumber is Number,
                                                                        UpdatedList=ActualList.
/*Função para verificar se o jogador detentor das peças Piece1 na posição (X,Y)
 tem uma jogada possível para a célula imediatamente à direita. Se for, atualiza a lista de jogadas possíveis e incrementa o número das mesmas*/ 
 verify_right_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):-  
                                                                   
                                                                    get_value_from_matrix([H|T],X,Y,Value),
                                                                    Value \= Piece1,
                                                                    ActualNumber is Number,
                                                                    UpdatedList=ActualList.
                                                                    
 verify_right_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):-
                                                Y1 is Y+1,
                                                get_value_from_matrix([H|T],X,Y,Piece1),    
                                                                                            
                                                get_value_from_matrix([H|T],X,Y1,Piece2), 
                                                                                                
                                                ActualNumber is Number + 1,
                                                append(ActualList,[[X,Y,X,Y1]],UpdatedList).
    
    

verify_right_move([H|T],X,Y,Piece1,Piece2,Number,ActualNumber,ActualList,UpdatedList):-
                                                                ActualNumber is Number,
                                                                UpdatedList=ActualList.
    
    
/*Predicado que calcula o número de jogadas possíveis e a lista das mesmas de um determinado jogador*/
check_number_plays(Board,7,8,Player,ActualNumber,FinalNumber,ActualList,ListOfMoves):- FinalNumber is ActualNumber,
                                                                                       ListOfMoves=ActualList.
                                                                                         

check_number_plays(Board,X,8,Player,ActualNumber,FinalNumber,ActualList,ListOfMoves):- 
                                                         X1 is X+1,
                                                         Y is 0,
                                                        check_number_plays(Board,X1,Y,Player,ActualNumber,FinalNumber,ActualList,ListOfMoves).

check_number_plays(Board,X,Y,Player,ActualNumber,FinalNumber,ActualList, ListOfMoves):-  
                                                        player_piece(Player,Piece1),
                                                        next_player(Player,NextPlayer),
                                                        player_piece(NextPlayer,Piece2),
                                                        verify_up_move(Board,X,Y,Piece1,Piece2,ActualNumber,Number1,ActualList,UpdatedList),
                                                        verify_down_move(Board,X,Y,Piece1,Piece2,Number1,Number2,UpdatedList,UpdatedList1),                                                      
                                                        verify_left_move(Board,X,Y,Piece1,Piece2,Number2,Number3,UpdatedList1,UpdatedList2),
                                                        verify_right_move(Board,X,Y,Piece1,Piece2,Number3,Number4,UpdatedList2,UpdatedList3),
                                                        Y1 is Y+1,
                                                        check_number_plays(Board,X,Y1,Player,Number4,FinalNumber,UpdatedList3,ListOfMoves).

/*Predicado que devolve uma lista de todas a jogadas possíveis de um determinado jogador a partir do tabuleiro*/
valid_moves(Board,Player,ListOfMoves):- 
                                                check_number_plays(Board,0,0,Player,0,FinalNumber,[],ListOfMoves).

/*Cláusula que verifica o estado do jogo, através de uma chamada ao predicado game_over. 
Se este for verdadeiro, termina a execução. Se não, é atualizado o jogador e chamado o loop_game com o jogador atualizado e o tabuleiro*/
check_game_state(Board,X,Y,Player,Bot,BotPlayer,BotPlayer2,Difficulty):-
                                                                        game_over(Board,X,Y,Player).

check_game_state(Board,X,Y,Player,Bot,BotPlayer,BotPlayer2,Difficulty):-
                                    \+game_over(Board,X,Y,Player),
                                    next_player(Player,NextPlayer),
                                    display_board(Board),
                                    sleep(0.5),
                                    loop_game(Board,NextPlayer,Player1,Bot,BotPlayer,BotPlayer2,Difficulty).


/*Predicado responsável que pede uma jogada ao jogador. 
 Verifica o tipo de jogo (Se bot_player2= 0 significa que não é computador vs computador).
 Verifica se existe algum bot a jogar (Se bot ='y').
 Verifica a dificuldade.
 No caso de ser um jogador que não o computador, então o botPlayer2 tem que ser 0 e o jogador tem que ser diferente do botPlayer1.
 Quando é um jogador contra o outro ambos os BotPlayers são 0.
 Por fim, é verificado o estado do jogo depois da jogada executada.*/

ask_new_play(Board, Player ,NextPlayer, NewBoard,Bot,BotPlayer1,BotPlayer2,Difficulty):-
        BotPlayer2 == 0,
        Player \== BotPlayer1,
        write('PLAYER '), write(Player),nl,
        ask_new_position(Player,Board,NewBoard2,BotPlayer1,Bot),
        check_game_state(NewBoard2,0,0,Player,Bot,BotPlayer1,BotPlayer2,Difficulty).


/*Bot ='y', logo existe pelo menos um computador a jogar. Player == BotPlayer1 significa que é a vez do computador jogar
É feita a chamada à função choose_move para definir qual o nivel de dificuldade.*/

ask_new_play(Board, Player ,NextPlayer, NewBoard,Bot,BotPlayer1,BotPlayer2,Difficulty):-
        Bot == 'y',
        Player==BotPlayer1, 
        write('PLAYER '), write(Player),nl,
        choose_move(Player,Board,NewBoard2,BotPlayer1,BotPlayer2,Difficulty),
        check_game_state(NewBoard2,0,0,Player,'y',BotPlayer1,BotPlayer2,Difficulty).
/*Quando são dois computadores a jogar e é a vez do segundo jogar. O nível é sempre o 1*/
ask_new_play(Board, Player ,NextPlayer, NewBoard,Bot,BotPlayer1,BotPlayer2,1):-
        Bot == 'y',
        Player==BotPlayer2,
        write('PLAYER '), write(Player),nl,
        generate_random_move(Player,Board,NewBoard2,BotPlayer1),
        check_game_state(NewBoard2,0,0,Player,'y',BotPlayer1,BotPlayer2,1).
/*Predicado esponsável pelo loop do jogo.  */
loop_game(Board,Player,NextPlayer,Bot,BotPlayer1,BotPlayer2,Difficulty):-
                   ask_new_play(Board, Player ,NextPlayer, NewBoard,Bot,BotPlayer1,BotPlayer2,Difficulty).