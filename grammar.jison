/*
    Organizacion de Lenguajes y Compiladores 1 "A"
    José Puac
    Clase 8
    Jison
*/

/* Definición Léxica */
%lex

%options case-insensitive

%%

/*Comentario de una línea*/
"//".*			 	{}
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]           {/*Ignorar comentario multilínea*/}


[ \r\t]+            {/*Retornos de carro y nuevas líneas*/}
\n                  {/*Saltos de línea*/}
\s+                 {/*Espacios en blanco*/}

/*------------Sentencias de control----------*/
"if"                return "IF";
"else"              return "ELSE";
"for"               return "FOR";
"while"             return "WHILE";
"do"                return "DO";
"switch"            return "SWITCH";
"case"              return "CASE";
"Default"           return "DEFAULT";
/*-------------------------------------------*/

/*------------Variables tipos----------------*/
"int"				return "INT";
"double"			return "DOUBLE";
"boolean"			return "BOOLEAN";
"char"				return "CHAR";
"string"			return "STRING";
/*-------------------------------------------*/

/*------------Secuencias de escape-----------*/
"\""[^\n\r]*"\""	return "CADENA";
"'"[^\n\r]?"'"		return "CARACTER";
"\\n"				return "SALTO_LINEA_T";
"\\\\"				return "DOBLE_BARRA_T";
"\\\""				return "COMILLAS_T";
"\\t"				return "TABULADOR_T";
"\\\'"				return "COMILLA_T"
"\'"				return "COMILLA";
"\""				return "COMILLAS";
/*-------------------------------------------*/

/*--------Palabras de funciones y métodos----*/
"void"              return "VOID";
"print"             return "PRINT";
"tolower"           return "TO_LOWER";
"toupper"           return "TO_UPPER";
"length"            return "LENGTH";
"round"             return "ROUND";
"typeof"            return "TYPEOF";
"tostring"          return "TO_STRING";
"tochararray"       return "TO_CHAR_ARRAY";
"exec"              return "EXEC";
"truncate"          return "TRUNCATE";
/*-------------------------------------------*/


/*--------Sentencias de transferencia--------*/
"continue"          return "CONTINUE";
"break"             return "BREAK";
"return"            return "RETURN";
/*-------------------------------------------*/

/*---------operaciones relacionales----------*/
">="                return 'MAYOR_I';
"<="                return 'MENOR_I';
"=="                return 'IGUAL';
"!="                return 'DIFERENTE';
">"                 return 'MAYOR';
"<"                 return 'MENOR';
/*-------------------------------------------*/

/*---------operaciones aritméticas-----------*/
"^"				    return "POTENCIA";
"+"                 return 'MAS';
"-"                 return 'MENOS';
"*"                 return 'POR';
"/"                 return 'DIV';
"%"                 return 'MOD';
/*-------------------------------------------*/


/*-----------otras palabras reservadas-------*/
"add"               return "ADD";
"new"               return "NEW";
"list"              return "LISTA";
";"                 return 'PUNTOCOMA';
":"					return 'DOSPUNTOS';
","					return 'COMA';
"("                 return 'PARENTESIS_A';
")"                 return 'PARENTESIS_C';
"["					return 'CORCHETE_A';
"]"					return 'CORCHETE_C';
'{'                 return 'LLAVE_A';
'}'                 return 'LLAVE_C';
"."					return "PUNTO";
"true"              return 'TRUE';
"false"             return 'FALSE';
//"++"                return 'INCREMENTO';
//"--"                return 'DECREMENTO';
"?"                 return 'TERNARIO';
"="                 return 'ASIGNACION';
/*-------------------------------------------*/


/*-------------operaciones lógicas-----------*/
"&&"                return 'AND';
"||"                return 'OR';
"!"                 return 'NOT';
/*-------------------------------------------*/

/*--------------------identificadores---------------------*/
[a-z]([a-z]|[0-9])*     				return 'ID';
[0-9]+("."[0-9]+)\b    					return 'DECIMAL';
[0-9]+\b    							return 'ENTERO';
/*--------------------------------------------------------*/


<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex

/* Asociación de operadores y precedencia */

%left 'OR'
%left 'AND'
%right 'NOT'
%left 'IGUAL' 'DIFERENTE'
%left 'MENOR' 'MAYOR' 'MAYOR_I' 'MENOR_I' 
%left 'MAS' 'MENOS'
%left 'POR' 'DIV' 'MOD'
//%left 'POTENCIA'
%right UMENOS

%start ini

%% /* Definición de la gramática */

ini
	:creacion_variable EOF {console.log($$)}
;






metodos_nativos
	: LENGTH PARENTESIS_A CADENA PARENTESIS_C 			{$$ = $1+' '+$2+' '+$3+' '+$4}
	| LENGTH PARENTESIS_A acceso_lista PARENTESIS_C 	{$$ = $1+' '+$2+' '+$3+' '+$4}
	| LENGTH PARENTESIS_A acceso_vector PARENTESIS_C	{$$ = $1+' '+$2+' '+$3+' '+$4}
	| LENGTH PARENTESIS_A ID PARENTESIS_C				{$$ = $1+' '+$2+' '+$3+' '+$4}
	| TRUNCATE PARENTESIS_A numero PARENTESIS_C			{$$ = $1+' '+$2+' '+$3+' '+$4}
	| TRUNCATE PARENTESIS_A ID PARENTESIS_C				{$$ = $1+' '+$2+' '+$3+' '+$4}
	| TYPEOF PARENTESIS_A expresion PARENTESIS_C		{$$ = $1+' '+$2+' '+$3+' '+$4}
	| TO_STRING PARENTESIS_A ID PARENTESIS_C			{$$ = $1+' '+$2+' '+$3+' '+$4}
	| TO_STRING PARENTESIS_A numero PARENTESIS_C		{$$ = $1+' '+$2+' '+$3+' '+$4}
	| TO_STRING PARENTESIS_A TRUE PARENTESIS_C			{$$ = $1+' '+$2+' '+$3+' '+$4}
	| TO_STRING PARENTESIS_A FALSE PARENTESIS_C			{$$ = $1+' '+$2+' '+$3+' '+$4}
	| TO_CHAR_ARRAY PARENTESIS_A CADENA PARENTESIS_C	{$$ = $1+' '+$2+' '+$3+' '+$4}
	| TO_CHAR_ARRAY PARENTESIS_A ID PARENTESIS_C		{$$ = $1+' '+$2+' '+$3+' '+$4}
	| ROUND PARENTESIS_A DECIMAL PARENTESIS_C			{$$ = $1+' '+$2+' '+$3+' '+$4}
	| ROUND PARENTESIS_A ID PARENTESIS_C				{$$ = $1+' '+$2+' '+$3+' '+$4}
;


creacion_variable
	: asignacion_tipo asignacion_variable {$$ = $1+' '+$2}
;


asignacion_variable
	: ID asignacion_valor_variable {$$ = $1+' '+$2}
;

asignacion_valor_variable
	: PUNTOCOMA {$$ = $1+''}	
	| ASIGNACION operacion_aritmetica PUNTOCOMA {$$ = $1+' '+$2+' '+$3}
	| ASIGNACION TO_UPPER PARENTESIS_A CADENA PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION TO_LOWER PARENTESIS_A CADENA PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION PARENTESIS_A INT PARENTESIS_C expresion PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION PARENTESIS_A CHAR PARENTESIS_C expresion PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION PARENTESIS_A DOUBLE PARENTESIS_C expresion PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION metodos_nativos PUNTOCOMA {$$ = $1+' '+$2+' '+$3}
;


condiciones_logicas
	: condicion_logica operadores_logicos condiciones_logicas {$$ = $1+' '+$2+' '+$3}
	| condicion_logica {$$ = $1+''}	
;

operadores_logicos
	: OR {$$ = $1+''}	
	| AND {$$ = $1+''}	
;


condicion_logica		
	: expresion operadores_comparacion expresion {$$ = $1+' '+$2+' '+$3}
	| expresion {$$ = $1+''}
;



operadores_comparacion
	: MAYOR_I {$$ = $1+''}	
	| MENOR_I {$$ = $1+''}	
	| DIFERENTE {$$ = $1+''}	
	| IGUAL {$$ = $1+''}	
	| MAYOR {$$ = $1+''}	
	| MENOR	 {$$ = $1+''}	
;

expresion
	: numero					{$$ = $1+''}
	| NOT ID 					{$$ = $1+' '+$2}
	| ID 	 					{$$ = $1+''}
	| acceso_lista  			{$$ = $1+''}
	| acceso_vector				{$$ = $1+''} 
	| CADENA 					{$$ = $1+''}
	| CARACTER 					{$$ = $1+''}
	| TRUE 						{$$ = $1+''}	
	| FALSE 					{$$ = $1+''}
;

expresion_incremento
	: ID MENOS MENOS			{$$ = $1+' '+$2+' '+$3}
	| ID MAS MAS				{$$ = $1+' '+$2+' '+$3}
;

numero	
	: MENOS DECIMAL %prec UMENOS	{$$ = $1+' '+$2}
	| MENOS ENTERO %prec UMENOS	 	{$$ = $1+' '+$2}
	| ENTERO						{$$ = $1+''}
	| DECIMAL 						{$$ = $1+''}
;

operacion_aritmetica
	: expresion operadores_aritmeticos operacion_aritmetica {$$ = $1+' '+$2+' '+$3}
	| expresion {$$ = $1+''}
;


operadores_aritmeticos
	: MAS {$$ = $1+''}
	| MENOS {$$ = $1+''}	
	| POR {$$ = $1+''}
	| DIV {$$ = $1+''}
	| POTENCIA {$$ = $1+''}
	| MOD {$$ = $1+''}
;


asignacion_tipo
	: INT {$$ = $1+''}	
	| BOOLEAN {$$ = $1+''}	
	| STRING {$$ = $1+''}	
	| DOUBLE {$$ = $1+''}	
	| CHAR {$$ = $1+''}	
;


acceso_vector
	: ID CORCHETE_A numero CORCHETE_C {$$ = $1+' '+$2+' '+$3+' '+$4}
;

acceso_lista
	: ID CORCHETE_A CORCHETE_A numero CORCHETE_C CORCHETE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;