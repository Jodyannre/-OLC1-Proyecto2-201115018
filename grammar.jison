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
"'"[^\n\r]"'"		return "CARACTER";
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
"tochararray"       return "TO_CHARARRAY";
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

/*-----------otras palabras reservadas-------*/
"add"               return "ADD";
"new"               return "NEW";
"list"              return "LISTA";
";"                 return 'PUNTOCOMA';
"("                 return 'PARENTESIS_A';
")"                 return 'PARENTESIS_C';
'{'                 return 'LLAVE_A';
'}'                 return 'LLAVE_C';
"true"              return 'TRUE';
"false"             return 'FALSE';
"++"                return 'INCREMENTO';
"--"                return 'DECREMENTO';
"?"                 return 'TERNARIO';
"="                 return 'IGUAL';
/*-------------------------------------------*/

/*---------operaciones aritméticas-----------*/
"^"				    return "POTENCIA";
"+"                 return 'MAS';
"-"                 return 'MENOS';
"*"                 return 'POR';
"/"                 return 'DIV';
"%"                 return 'MOD';
/*-------------------------------------------*/

/*-------------operaciones lógicas-----------*/
"&&"                return 'AND';
"||"                return 'OR';
"!"                 return 'NOT';
/*-------------------------------------------*/

/*--------------------identificadores---------------------*/
[a-z]([a-z]|[0-9])*     				return 'ID'
[0-9]+("."[0-9]+)?\b    				return 'NUMERO';
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
%left UMENOS

%start ini

%% /* Definición de la gramática */

ini
	: ciclo_for EOF {console.log($$)}
;

ciclo_for
    : FOR PARENTESIS_A ciclo_for_variable ID operadores_comparacion NUMERO PUNTOCOMA ID operadores_incremento 
	  PARENTESIS_C LLAVE_A LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9+' '+$10+' '+$11+' '+$12}
;

ciclo_for_variable
	: creacion_variable {$$ = $1}
	| asignacion_variable {$$ = $1}
;

ciclo_for_incremento
	: ID operadores_incremento
	| ID IGUAL valor_en_asignacion_variable
;

creacion_variable
	: asignacion_tipo asignacion_variable {$$ = $1+' '+$2}
;


asignacion_variable
	: ID asignacion_valor_variable {$$ = $1+' '+$2}
;



asignacion_valor_variable
	: PUNTOCOMA {$$ = $1+''}	
	| IGUAL valor_en_asignacion_variable PUNTOCOMA {$$ = $1+' '+$2+' '+$3}
;

valor_en_asignacion_variable
	: NUMERO {$$ = $1+''}	
	| CADENA {$$ = $1+''}	
	| TRUE {$$ = $1+''}	
	| FALSE {$$ = $1+''}	
	| CARACTER {$$ = $1+''}	
	| ID {$$ = $1+''}
	| operaciones_aritmeticas {$$ = $1+''}	
;

asignacion_tipo
	: INT {$$ = $1+''}	
	| BOOLEAN {$$ = $1+''}	
	| STRING {$$ = $1+''}	
	| DOUBLE {$$ = $1+''}	
	| CHAR {$$ = $1+''}	
;

condiciones_logicas
	: condicion_logica operadores_logicos condiciones_logicas {$$ = $1+' '+$2+' '+$3}
	| condicion_logica {$$ = $1+''}	
;

operadores_logicos
	: OR {$$ = $1+''}	
	| AND {$$ = $1+''}	
;

operadores_incremento
	: INCREMENTO {$$ = $1+''}	
	| DECREMENTO {$$ = $1+''}	
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
	: MENOS numero 	{$$ = $1+' '+$2}
	| numero 		{$$ = $1+''}	
	| NOT ID 		{$$ = $1+' '+$2}
	| ID 	 		{$$ = $1+''}
;

operaciones_aritmeticas
	: operacion_aritmetica operadores_aritmeticos operaciones_aritmeticas
	| operacion_aritmetica
;

operacion_aritmetica
	: expresion operadores_aritmeticos expresion
	| expresion
;

numero
	: ENTERO {$$ = $1+''}
	| DECIMAL {$$ = $1+''}
;


operadores_aritmeticos
	: MAS
	| MENOS
	| POR
	| DIV
	| POTENCIA
	| MOD
;