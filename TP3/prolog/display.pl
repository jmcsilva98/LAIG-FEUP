initialBoard([[black,white,black,white,black,white,black,white],
              [white,black,white,black,white,black,white,black],
              [black,white,black,white,black,white,black,white],
              [white,black,white,black,white,black,white,black],
              [black,white,black,white,black,white,black,white],
              [white,black,white,black,white,black,white,black],
              [black,white,black,white,black,white,black,white],
              [white,black,white,black,white,black,white,black]
]).
finalBoard([ [black,white,empty,empty,empty,empty,empty,empty],
                     [empty,empty,black,empty,empty,empty,empty,empty],
                     [empty,empty,empty,empty,empty,empty,empty,white],
                     [empty,empty,empty,empty,empty,empty,empty,empty],
                     [empty,white,empty,empty,black,white,empty,empty],
                     [empty,empty,empty,empty,empty,empty,empty,empty],
                     [empty,empty,empty,empty,empty,empty,empty,empty],
                     [empty,empty,empty,empty,empty,empty,empty,empty]
]).
translate(empty,'.').
translate(black,'O').
translate(white,'W').

/* Incrementa o valor de X em um, usado para colocar os indices das linhas do tabuleiro */
incr(X, X1) :-
                X1 is X+1.

/* Predicado inicial que imprime o tabuleiro do jogo */
display_board([H|T]):-  
                    nl,
                    write('  | A | B | C | D | E | F | G | H |\n'),
                    write('  |---|---|---|---|---|---|---|---|\n'),
                    print_tab([H|T],1).
                    
/* Clausula responsavel por imprimir o resto do tabuleiro */
print_tab([],_).
print_tab([H|T],X):- 
                write(X),
                write(' '),
                write('|'),
                write(' '),
                print_line(H),  
                nl,
                write('  |---|---|---|---|---|---|---|---|\n'),
                incr(X,X1),
                print_tab(T,X1).

/* Predicado responsavel por imprimir cada linha do tabuleiro */ 
print_line([]).
print_line([C|L]):-
                 print_cel(C),
                 write(' '),
                 write('|'),
                 write(' '),
                 print_line(L).

/* Predicado que imprime cada celula do tabuleiro */
print_cel(C):-
               translate(C,V),
                write(V).


