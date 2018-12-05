choose_move(Player,Board,NewBoard2,BotPlayer1,BotPlayer2,1):-
                                                generate_random_move(Player,Board,NewBoard2,BotPlayer).


choose_move(Player,Board,NewBoard2,BotPlayer1,BotPlayer2,2):-
                                                generate_best_move(Player,X,Y,NewX,NewY,Board,NewBoard2,BotPlayer,BotPlayer2).


/*Função que gera um movimento aleatório de um determinado jogador.
 A partir da lista de jogadas possíveis desse jogador, é gerado um número aleatório entre 0 
 e o comprimento da lista de modo a escolher a jogada a executar.*/
generate_random_move(Player,Board,NewBoard2,BotPlayer):-
            valid_moves(Board,Player,ListOfMoves),
            length(ListOfMoves,Size),
            random(0,Size,Position),
            get_value_from_list(ListOfMoves,Position,[X,Y,X1,Y1]),
            move(X,X1,Y,Y1,Player,Board,NewBoard2,'y',BotPlayer,1).

/*Função que, no caso de ser jogador vs computador escolher se o computador é o jogador 1 ou o jogador 2*/
choose_bot_player(Player):-
        random(1,3,Player).

/*Predicado que gera o melhor movimento do computador. 
A partir da lista de jogadas possíveis, executa aquela que fará com que o jogador seguinte tenha o menor número de jogadas possíveis*/
generate_best_move(Player,X,Y,NewX,NewY,Board,NewBoard2,BotPlayer,BotPlayer2):-
                            valid_moves(Board,Player,ListOfMoves),
                            length(ListOfMoves,Size),
                            check_best_move(Board,NewBoard2,X,Y,NewX,NewY,1000,ListOfMoves,0,Size,BotPlayer,Player).
/*Predicado que verifica se a jogada atual é melhor que a anterior*/
check_best_move(Board,NewBoard2,X,Y,NewX,NewY,BestNextPlay,ListOfMoves,CurrentPosition,Size,BotPlayer,Player):-
                                                CurrentPosition == Size,
                                                write(BestNextPlay),nl,
                                                move(X,NewX,Y,NewY,Player,Board,NewBoard2,'y',BotPlayer,2).
                                               

check_best_move(Board,NewBoard2,X,Y,NewX,NewY,BestNextPlay,ListOfMoves,CurrentPosition,Size,BotPlayer,Player):-
                                                CurrentPosition < Size,                                               
                                                get_value_from_list(ListOfMoves,CurrentPosition,[X1,Y1,X2,Y2]),
                                                Board1 = Board,
                                                move(X1,X2,Y1,Y2,Player,Board,NewBoard,'y',BotPlayer,2),
                                                next_player(Player,NextPlayer),
                                                check_number_plays(NewBoard,0,0,NextPlayer,0,FinalNumber,[],List),
                                                check_best_play(Board1,NewBoard2,X,Y,NewX,NewY,X1,Y1,X2,Y2,BestNextPlay,ListOfMoves,CurrentPosition,Size,BotPlayer,Player,FinalNumber).

                                                 
/*Predicado que compara o número de jogadas que o jogador seguinte tem consoante a jogada anterior e a jogada atual.*/
check_best_play(Board,NewBoard2,X,Y,NewX,NewY,X1,Y1,X2,Y2,BestNextPlay,ListOfMoves,CurrentPosition,Size,BotPlayer,Player,FinalNumber):-
                                                CurrentPosition < Size,
                                                FinalNumber < BestNextPlay,
                                                CurrentPosition1 is CurrentPosition+1,
                                                check_best_move(Board,NewBoard2,X1,Y1,X2,Y2,FinalNumber,ListOfMoves,CurrentPosition1,Size,BotPlayer,Player).
    
check_best_play(Board,NewBoard2,X,Y,NewX,NewY,X1,Y1,X2,Y2,BestNextPlay,ListOfMoves,CurrentPosition,Size,BotPlayer,Player,FinalNumber):-
                                                FinalNumber >= BestNextPlay,
                                                CurrentPosition1 is CurrentPosition+1,
                                                check_best_move(Board,NewBoard2,X,Y,NewX,NewY,BestNextPlay,ListOfMoves,CurrentPosition1,Size,BotPlayer,Player).
                                        

                