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
	:instrucciones_globales EOF {console.log($$)}
;




/*GRAMATICA OPERACIONES LÓGICAS Y ARITMÉTICAS-------------------------------*/
condiciones_logicas
	: condicion_comparacion operadores_logicos condiciones_logicas {$$ = $1+' '+$2+' '+$3}
	| condicion_comparacion operadores_logicos ID {$$ = $1+' '+$2+' '+$3}
	| condicion_logica operadores_logicos condiciones_logicas {$$ = $1+' '+$2+' '+$3}
	| condicion_logica operadores_logicos ID {$$ = $1+' '+$2+' '+$3}
	| condicion_comparacion {$$ = $1+''}	
	| condicion_logica {$$ = $1}
;

condicion_logica
	: ID operadores_logicos ID 						{$$ = $1+' '+$2+' '+$3}
	| ID operadores_logicos condicion_comparacion 	{$$ = $1+' '+$2+' '+$3}
;

condicion_comparacion		
	: expresion operadores_comparacion expresion {$$ = $1+' '+$2+' '+$3}
;

operadores_logicos
	: OR 	{$$ = $1+''}	
	| AND 	{$$ = $1+''}	
;

operadores_comparacion
	: MAYOR_I 	{$$ = $1+''}	
	| MENOR_I 	{$$ = $1+''}	
	| DIFERENTE {$$ = $1+''}	
	| IGUAL 	{$$ = $1+''}	
	| MAYOR 	{$$ = $1+''}	
	| MENOR	 	{$$ = $1+''}	
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

numero	
	: MENOS DECIMAL %prec UMENOS	{$$ = $1+' '+$2}
	| MENOS ENTERO %prec UMENOS	 	{$$ = $1+' '+$2}
	| ENTERO						{$$ = $1+''}
	| DECIMAL 						{$$ = $1+''}
;

operacion_aritmetica
	: expresion operadores_aritmeticos operacion_aritmetica_validador {$$ = $1+' '+$2+' '+$3}
	//| expresion {$$ = $1+''}
;

operacion_aritmetica_validador
	: operacion_aritmetica {$$ = $1+''}
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

expresion_incremento
	: ID MENOS MENOS			{$$ = $1+' '+$2+' '+$3}
	| ID MAS MAS				{$$ = $1+' '+$2+' '+$3}
;
/*GRAMATICA OPERACIONES LÓGICAS Y ARITMÉTICAS-------------------------------*/


/*METODOS NATIVOS-----------------------------------------------------------*/
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
/*METODOS NATIVOS-----------------------------------------------------------*/


/*GRAMATICA ASIGNACION VARIABLE---------------------------------------------*/
instrucciones_globales
	: instruccion_global instrucciones_globales	{$$ = $1+' '+$2}
	| instruccion_global 						{$$ = $1+''}
;

instrucciones_locales
	: instruccion_local instrucciones_locales
	| instruccion_local
;

instruccion_local
	: instruccion_local_metodo
	| CONTINUE PUNTOCOMA
	| BREAK PUNTOCOMA
;

instrucciones_locales_metodo
	: instruccion_local_metodo instrucciones_locales_metodo	{$$ = $1+' '+$2}
	| instruccion_local_metodo 								{$$ = $1+''}
;

instruccion_local_metodo
	: creacion_variable 			{$$ = $1+''}
	| asignacion_variable 			{$$ = $1+''}
	| manejo_vector_lista			{$$ = $1+''}
	| ciclo_for						{$$ = $1+''}
	| ciclo_do_while				{$$ = $1+''}
	| ciclo_while					{$$ = $1+''}
	| condicion_if					{$$ = $1+''}
	| condicion_switch				{$$ = $1+''}
	| llamada_metodo_funcion 		{$$ = $1+''}
	| RETURN operacion_aritmetica PUNTOCOMA {$$ = $1+' '+$2+' '+$3}
	| RETURN condiciones_logicas PUNTOCOMA {$$ = $1+' '+$2+' '+$3}
	| RETURN expresion PUNTOCOMA	{$$ = $1+' '+$2}
	| RETURN PUNTOCOMA				{$$ = $1+''}
;

instruccion_global 
	: creacion_variable 			{$$ = $1+''}
	| asignacion_variable 			{$$ = $1+''}
	| manejo_vector_lista			{$$ = $1+''}
	| ciclo_for						{$$ = $1+''}
	| ciclo_do_while				{$$ = $1+''}
	| ciclo_while					{$$ = $1+''}
	| condicion_if					{$$ = $1+''}
	| condicion_switch				{$$ = $1+''}
	| declaracion_funcion_metodo 	{$$ = $1+''}
	| llamada_metodo_funcion 		{$$ = $1+''}
;

creacion_variable
	: asignacion_tipo asignacion_variable {$$ = $1+' '+$2}
;

asignacion_variable
	: ID asignacion_valor_variable 				{$$ = $1+' '+$2}
	| acceso_lista asignacion_valor_variable 	{$$ = $1+' '+$2}
	| acceso_vector asignacion_valor_variable 	{$$ = $1+' '+$2}
;

asignacion_valor_variable
	: PUNTOCOMA 														{$$ = $1+''}	
	| ASIGNACION operacion_aritmetica PUNTOCOMA 						{$$ = $1+' '+$2+' '+$3}
	| ASIGNACION TO_UPPER PARENTESIS_A CADENA PARENTESIS_C PUNTOCOMA 	{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION TO_UPPER PARENTESIS_A ID PARENTESIS_C PUNTOCOMA 		{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION TO_LOWER PARENTESIS_A CADENA PARENTESIS_C PUNTOCOMA 	{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION TO_LOWER PARENTESIS_A ID PARENTESIS_C PUNTOCOMA 		{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION PARENTESIS_A INT PARENTESIS_C expresion PUNTOCOMA 		{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION PARENTESIS_A CHAR PARENTESIS_C expresion PUNTOCOMA 	{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION PARENTESIS_A DOUBLE PARENTESIS_C expresion PUNTOCOMA 	{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION metodos_nativos PUNTOCOMA 								{$$ = $1+' '+$2+' '+$3}
	| ASIGNACION condiciones_logicas TERNARIO expresion DOSPUNTOS expresion PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| ASIGNACION expresion PUNTOCOMA 									{$$ = $1+' '+$2+' '+$3}
;

asignacion_valor_vector
	: ASIGNACION NEW asignacion_tipo CORCHETE_A numero CORCHETE_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| ASIGNACION LLAVE_A elementos_coma LLAVE_C PUNTOCOMA 					{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
;


asignacion_tipo
	: INT 		{$$ = $1+''}	
	| BOOLEAN 	{$$ = $1+''}	
	| STRING 	{$$ = $1+''}	
	| DOUBLE 	{$$ = $1+''}	
	| CHAR 		{$$ = $1+''}	
;
/*GRAMATICA ASIGNACION VARIABLE---------------------------------------------*/


/*GRAMATICA FOR-------------------------------------------------------------*/
ciclo_for
    : FOR PARENTESIS_A ciclo_for_variable condiciones_logicas PUNTOCOMA ciclo_for_incremento
	PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9}
;

ciclo_for_variable
	: creacion_variable 	{$$ = $1+''}
	| asignacion_variable 	{$$ = $1+''}
;

ciclo_for_incremento
	: ID ASIGNACION operacion_aritmetica{$$ = $1+' '+$2+' '+$3}
	| ID MENOS MENOS					{$$ = $1+' '+$2+' '+$3}
	| ID MAS MAS						{$$ = $1+' '+$2+' '+$3}	
;

expresion_incremento
	: ID MENOS MENOS			{$$ = $1+' '+$2+' '+$3}
	| ID MAS MAS				{$$ = $1+' '+$2+' '+$3}
;
/*GRAMATICA FOR-------------------------------------------------------------*/


/*GRAMATICA DO WHILE--------------------------------------------------------*/
ciclo_do_while
	: DO LLAVE_A /*instrucciones*/ LLAVE_C WHILE PARENTESIS_A ciclo_while_condicion PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+''+$7}
;
ciclo_while_condicion
	: condiciones_logicas PARENTESIS_C  {$$ = $1+' '+$2}
	| ID PARENTESIS_C 					{$$ = $1+' '+$2}
	| TRUE PARENTESIS_C 				{$$ = $1+' '+$2}
;
/*GRAMATICA DO WHILE--------------------------------------------------------*/


/*GRAMATICA WHILE-----------------------------------------------------------*/
ciclo_while
	:	WHILE PARENTESIS_A ciclo_while_condicion LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
;
/*GRAMATICA WHILE-----------------------------------------------------------*/


/*GRAMATICA IF ELSE---------------------------------------------------------*/
condicion_if
	: IF PARENTESIS_A ciclo_while_condicion  LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	| IF PARENTESIS_A ciclo_while_condicion  LLAVE_A /*instrucciones*/ LLAVE_C condicion_if_else {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;

condicion_if_else
	: ELSE LLAVE_A /*instrucciones*/ LLAVE_C 	{$$ = $1+' '+$2+' '+$3}
	| ELSE condicion_if 						{$$ = $1+' '+$2}
;
/*GRAMATICA IF ELSE---------------------------------------------------------*/



/*GRAMATICA SWITCH----------------------------------------------------------*/
condicion_switch
	: SWITCH PARENTESIS_A ID PARENTESIS_C LLAVE_A condiciones_case_switch LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
;

condiciones_case_switch
	: condicion_case condiciones_case_switch 	{$$ = $1+' '+$2}
	| condicion_case 							{$$ = $1+''}
;

condicion_case
	//: CASE ENTERO DOSPUNTOS /*instrucciones*/ BREAK PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	: CASE ENTERO DOSPUNTOS /*instrucciones*/	{$$ = $1+' '+$2+' '+$3}
	//| DEFAULT DOSPUNTOS /*instrucciones*/ BREAK PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
	| DEFAULT DOSPUNTOS /*instrucciones*/		{$$ = $1+' '+$2}
;
/*GRAMATICA SWITCH----------------------------------------------------------*/



/*MANEJO DE LISTAS Y VECTORES-----------------------------------------------*/
manejo_vector_lista
	: asignacion_tipo CORCHETE_A CORCHETE_C ID ASIGNACION NEW asignacion_tipo CORCHETE_A numero CORCHETE_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9+' '+$10+' '+$11}
	| asignacion_tipo CORCHETE_A CORCHETE_C ID ASIGNACION LLAVE_A elementos_coma LLAVE_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9}
	//| acceso_vector ASIGNACION operacion_aritmetica PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
	| LISTA MENOR asignacion_tipo MAYOR ID ASIGNACION NEW LISTA MENOR asignacion_tipo MAYOR PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9+' '+$10+' '+$11+' '+$12}
	| ID PUNTO ADD PARENTESIS_A expresion PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	//| acceso_lista ASIGNACION operacion_aritmetica PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
;

elementos_coma
	: expresion COMA elementos_coma {$$ = $1+' '+$2+' '+$3}
	| expresion 					{$$ = $1}
;

acceso_vector
	: ID CORCHETE_A numero CORCHETE_C {$$ = $1+' '+$2+' '+$3+' '+$4}
;

acceso_lista
	: ID CORCHETE_A CORCHETE_A numero CORCHETE_C CORCHETE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;
/*MANEJO DE LISTAS Y VECTORES-----------------------------------------------*/


/*GRAMATICA METODOS Y FUNCIONES---------------------------------------------*/
declaracion_funcion_metodo
	: asignacion_tipo ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| asignacion_tipo ID PARENTESIS_A PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| VOID ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| VOID ID PARENTESIS_A PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;

definicion_parametros
	: asignacion_tipo ID COMA definicion_parametros {$$ = $1+' '+$2+' '+$3+' '+$4}
	| asignacion_tipo ID 							{$$ = $1+' '+$2}
;
/*GRAMATICA METODOS Y FUNCIONES---------------------------------------------*/


/*LLAMADAS A METODO Y FUNCIONES INCLUYENDO EXEC Y PRINT---------------------*/
llamada_metodo_funcion
	: ID PARENTESIS_A elementos_coma PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	| ID PARENTESIS_A PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
	| PRINT PARENTESIS_A CADENA PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	| PRINT PARENTESIS_A ID PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	| EXEC ID PARENTESIS_A elementos_coma PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+''+$6}
	| EXEC ID PARENTESIS_A PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
;
/*LLAMADAS A METODO Y FUNCIONES INCLUYENDO EXEC Y PRINT---------------------*/