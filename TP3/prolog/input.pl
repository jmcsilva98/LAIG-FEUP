insert_row(NumberRow):- read_row(Row),
                        validate_row(Row,NumberRow).

                        


insert_column(NumberColumn):- read_column(Column),
                       validate_column(Column,NumberColumn).

read_row(Row):- write('Row: '),nl,
               read(Row),
               integer(Row).

read_row(Row):-  write('Row invalid! Your row must be an integer between 1-8!\n\n'),
                 read_row(Row).
read_column(Column):- 
                    write('Column: '),nl,
                    read(Column),
                    atom(Column).

read_column(Column):-    write('Column invalid! Your column must be a letter between 1-8!\n\n'),
                         read_column(Column).

validate_column(a,0).
validate_column(b,1).
validate_column(c,2).
validate_column(d,3).
validate_column(e,4).
validate_column(f,5).
validate_column(g,6).
validate_column(h,7).
validate_column(_Column,NumberColumn):- 
    write('Column invalid! Please insert a column between a-h!\n\n'),
    read_column(Input),
    validate_column(Input, NumberColumn).

validate_row(1,0).
validate_row(2,1).
validate_row(3,2).
validate_row(4,3).
validate_row(5,4).
validate_row(6,5).
validate_row(7,6).
validate_row(8,7).
validate_row(_Row,NumberRow):- 
    write('Row invalid! Please insert a row between 1-8!\n\n'),
    read_row(Input),
    validate_row(Input,NumberRow).

validate_move(Row,NewRow,Column,NewColumn,Player,Board,BotPlayer):-
        get_value_from_matrix(Board,Row,Column,Value),
        player_piece(Player,Piece),
        Value == Piece,
        get_value_from_matrix(Board,NewRow,NewColumn,Value1),
        next_player(Player,NextPlayer),
        player_piece(NextPlayer,NextPiece),
        Value1 == NextPiece.
move(Row,NewRow,Column,NewColumn,Player,Board,NewBoard2,Bot,BotPlayer,Difficulty):-
        Row == NewRow,
        NewColumn =:= Column +1,
        validate_move(Row,NewRow,Column,NewColumn,Player,Board,BotPlayer),
        player_piece(Player,Piece),
        replace_in_matrix(Board,NewRow,NewColumn,Piece,NewBoard),
        replace_in_matrix(NewBoard,Row,Column,'empty',NewBoard2),
        show_positions(Row,NewRow,Column,NewColumn).
move(Row,NewRow,Column,NewColumn,Player,Board,NewBoard2,Bot,BotPlayer,Difficulty):-
       
        Row==NewRow,
        NewColumn =:= Column - 1,
        validate_move(Row,NewRow,Column,NewColumn,Player,Board,BotPlayer),
         player_piece(Player,Piece),
        replace_in_matrix(Board,NewRow,NewColumn,Piece,NewBoard),
        replace_in_matrix(NewBoard,Row,Column,'empty',NewBoard2),
        show_positions(Row,NewRow,Column,NewColumn).
move(Row,NewRow,Column,NewColumn,Player,Board,NewBoard2,Bot,BotPlayer,Difficulty):-
        
        Column==NewColumn,
         NewRow =:= Row -1,
        validate_move(Row,NewRow,Column,NewColumn,Player,Board,BotPlayer),
        player_piece(Player,Piece),
        replace_in_matrix(Board,NewRow,NewColumn,Piece,NewBoard),
        replace_in_matrix(NewBoard,Row,Column,'empty',NewBoard2),
        show_positions(Row,NewRow,Column,NewColumn).
move(Row,NewRow,Column,NewColumn,Player,Board,NewBoard2,Bot,BotPlayer,Difficulty):-
        Column==NewColumn,
        NewRow =:= Row + 1,
        validate_move(Row,NewRow,Column,NewColumn,Player,Board,BotPlayer),
        player_piece(Player,Piece),
        replace_in_matrix(Board,NewRow,NewColumn,Piece,NewBoard),
        replace_in_matrix(NewBoard,Row,Column,'empty',NewBoard2),
        show_positions(Row,NewRow,Column,NewColumn).

move(Row,NewRow,Column,NewColumn,Player,Board,NewBoard2,Bot,BotPlayer,0) :-
    write('Your new coordinates must be adjacent with actual position and you only can move your pieces!!\n'),
    ask_new_position(Player,Board,NewBoard2,Bot,BotPlayer).

ask_new_position(Player,Board,NewBoard2,Bot,BotPlayer):-
        insert_row(Row),
        insert_column(Column),
        insert_row(NewRow),
        insert_column(NewColumn),
        show_positions(Row,NewRow,Column,NewColumn),
        move(Row,NewRow,Column,NewColumn,Player,Board,NewBoard2,Bot,BotPlayer,0).


show_positions(Row,NewRow,Column,NewColumn):-
                         validate_row(Row1,Row),
                         validate_row(Row2,NewRow),
                         validate_column(Column1,Column),
                         validate_column(Column2,NewColumn),
                         write('MOVEMENT'),nl,
                         write('['), write(Row1), write(','),write(Column1),write(']'),nl,
                         write('['), write(Row2), write(','),write(Column2),write(']'),nl.

                                        