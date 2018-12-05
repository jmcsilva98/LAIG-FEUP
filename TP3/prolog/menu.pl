/* JOGADOR VS JOGADOR*/
start_game(1):-
                initialBoard(Board),
                display_board(Board),
                loop_game(Board,1,NextPlayer,'n',0,0,0).


/*JOGADOR VS COMPUTADOR NIVEL 1*/
start_game(2):-finalBoard(Board),
                display_board(Board),
                loop_game(Board,1,NextPlayer,'y',2,0,1).

/*COMPUTADOR VS JOGADOR NIVEL 1*/
start_game(3):-initialBoard(Board),
                display_board(Board),
                loop_game(Board,1,NextPlayer,'y',1,0,1).

/*JOGADOR VS COMPUTADOR NIVEL 2*/
start_game(4):-initialBoard(Board),
                display_board(Board),
                loop_game(Board,1,NextPlayer,'y',2,0,2).

/*COMPUTADOR VS JOGADOR NIVEL 2*/
start_game(5):-initialBoard(Board),
                display_board(Board),
                loop_game(Board,1,NextPlayer,'y',1,0,2).

/*COMPUTADOR VS COMPUTADOR*/
start_game(6):-
                initialBoard(Board),
                display_board(Board),
                loop_game(Board,1,NextPlayer,'y',1,2,1).

/* Vai para o menu de informacoes */
start_game(7):- about_menu.

/* Sai do jogo */
start_game(8):- write('Leaving the game...').

/* No caso de haver algum input invalido */
start_game(_Option):- write('Error:: invalid input.'),nl,
                      write('INSERT YOUR OPTION: '),
                      read(Option),
                      integer(Option),
                      start_game(Option).

go_to_menu(1):-main_menu.
go_to_menu(2):- write('Leaving the game...').
go_to_menu(_Option):- write('Error:: invalid input.'),nl,
                      write('INSERT YOUR OPTION: '),
                      read(Option),
                      integer(Option),
                      go_to_menu(Option).



main_menu:- write('|--------------------------------------------------------------------|'),nl,
            write('|                                                                    |'),nl,
            write('|                                                                    |'),nl,
            write('|                    _         _      _                              |'),nl,
            write('|                   | |       | |    | |                             |'),nl,
            write('|              ____ | | _____ | |___ | |___    ___  ____             |'),nl,
            write('|             | ___|| ||     ||  _  ||  _  | / __ ||  __|            |'),nl,
            write('|             | (__ | || (_) || |_) || |_) ||____/ | |               |'),nl,
            write('|             |____||_||_____||_____||_____||_____||_|               |'),nl,
            write('|                                                                    |'),nl,
            write('|                          Ana Rita Norinho                          |'),nl,
            write('|                            Joana Silva                             |'),nl,
            write('|                                                                    |'),nl,
            write('|         --------------------------------------------------         |'),nl,                              
            write('|         |                                                |         |'),nl,
            write('|         |                                                |         |'),nl,
            write('|         |             1- JOGADOR VS JOGADOR              |         |'),nl,
            write('|         |       2- JOGADOR VS COMPUTADOR NIVEL 1         |         |'),nl,
            write('|         |       3- COMPUTADOR VS JOGADOR NIVEL 1         |         |'),nl,
            write('|         |       4- JOGADOR VS COMPUTADOR NIVEL 2         |         |'),nl,
            write('|         |       5- COMPUTADOR VS JOGADOR NIVEL 2         |         |'),nl,
            write('|         |         6- COMPUTADOR VS COMPUTADOR            |         |'),nl,
            write('|         |                   7- ABOUT                     |         |'),nl,
            write('|         |                   8- Exit                      |         |'),nl,
            write('|         --------------------------------------------------         |'),nl, 
            write('|                                                                    |'),nl,
            write('|                                                                    |'),nl,
            write('|                                                                    |'),nl,
            write('|--------------------------------------------------------------------|'),nl,
            write('INSERT YOUR OPTION: '),
            read(Option),
            integer(Option),
            start_game(Option).

main_menu:- write('Not a valid number! Please insert your option again.'),nl,
            main_menu.

about_menu:-write('|--------------------------------------------------------------------|'),nl,
            write('|                                                                    |'),nl,
            write('|                                                                    |'),nl,
            write('|                    _         _      _                              |'),nl,
            write('|                   | |       | |    | |                             |'),nl,
            write('|              ____ | | _____ | |___ | |___    ___  ____             |'),nl,
            write('|             | ___|| ||     ||  _  ||  _  | / __ ||  __|            |'),nl,
            write('|             | (__ | || (_) || |_) || |_) ||____/ | |               |'),nl,
            write('|             |____||_||_____||_____||_____||_____||_|               |'),nl,
            write('|                                                                    |'),nl,
            write('|                          Ana Rita Norinho                          |'),nl,
            write('|                            Joana Silva                             |'),nl,
            write('|                                                                    |'),nl,
            write('|                               ABOUT:                               |'),nl,
            write('|                                                                    |'),nl,
            write('|                                                                    |'),nl,
            write('|            Clobber, uma derivacao do jogo Peg Duotaire,            |'),nl,
            write('|          e um jogo abstrato de estrategia criado em 2001.          |'),nl,
            write('|           Neste jogo existem dois jogadores, que movem,            |'),nl,
            write('|        alternadamente, as suas pecas para uma peca de cor          |'),nl,
            write('|       oposta ortogonalmente adjacente, removendo-a do jogo.        |'),nl,
            write('|       No final, quem nao conseguir movimentar as suas pecas,       |'),nl,
            write('|                           perde o jogo.                            |'),nl,
            write('|                                                                    |'),nl,
            write('|                                                                    |'),nl,
            write('|                    1- Ir para o menu princial                      |'),nl,
            write('|                              2- Exit                               |'),nl,
            write('|--------------------------------------------------------------------|'),nl,
            write('INSERT YOUR OPTION: '),
            read(Option),
            integer(Option),
            go_to_menu(Option). 

about_menu:-  write('Not a valid number! Please insert your option again.'),nl,
              about_menu.       


