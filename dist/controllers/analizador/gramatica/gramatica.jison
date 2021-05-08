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
"\""[^\n\r]*"\""	{yytext = yytext.substr(1,yyleng-2); return "CADENA";}
"'"[^\n\r]?"'"		{yytext = yytext.substr(1,yyleng-2); return "CARACTER";}
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
"^"				    return 'POTENCIA';
"++"				return 'INCREMENTO';
"+"                 return 'MAS';
"--"				return 'DECREMENTO';
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
%left 'MAS' 'MENOS' 'INCREMENTO' 'DECREMENTO'
%left 'POR' 'DIV' 'MOD'
%nonassoc 'POTENCIA'
%right UMENOS

%start ini

%% /* Definición de la gramática */

ini
	//:instrucciones_globales EOF {console.log($$)}
	: instrucciones_globales EOF {console.log($$)}
;




/*GRAMATICA OPERACIONES LÓGICAS Y ARITMÉTICAS-------------------------------*/
condicion_logica
	: condicion_logica AND condicion_logica {$$ = $1+' '+$2+' '+$3}
	| condicion_logica OR condicion_logica {$$ = $1+' '+$2+' '+$3}
	| NOT condicion_logica {$$ = $1+' '+$2}
	| relacional {$$ = $1+' '}
;

relacional
	: relacional MAYOR_I relacional {$$ = $1+' '+$2+' '+$3}
	| relacional MENOR_I relacional {$$ = $1+' '+$2+' '+$3}
	| relacional IGUAL relacional {$$ = $1+' '+$2+' '+$3}
	| relacional MENOR relacional {$$ = $1+' '+$2+' '+$3}
	| relacional MAYOR relacional {$$ = $1+' '+$2+' '+$3}
	| relacional DIFERENTE relacional {$$ = $1+' '+$2+' '+$3}
	| expresion {$$ = $1+' '}
;

expresion
	: expresion POTENCIA expresion {$$ = $1+' '+$2+' '+$3}
	| expresion MENOS expresion {$$ = $1+' '+$2+' '+$3}
	| expresion POR expresion {$$ = $1+' '+$2+' '+$3}
	| expresion DIV expresion {$$ = $1+' '+$2+' '+$3}
	| expresion MAS expresion {$$ = $1+' '+$2+' '+$3}
	| expresion MOD expresion {$$ = $1+' '+$2+' '+$3}
	| expresion INCREMENTO  {$$ = $1+' '+$2}
	| expresion DECREMENTO  {$$ = $1+' '+$2}
	| PARENTESIS_A condicion_logica PARENTESIS_C {$$ = $1+' '+$2+' '+$3}
	| MENOS ENTERO %prec UMENOS {$$ = $1+' '+$2}
	| MENOS DECIMAL %prec UMENOS {$$ = $1+' '+$2}
	| ENTERO {$$ = $1+' '}
	| DECIMAL {$$ = $1+' '}
	| TRUE {$$ = $1+' '}
	| FALSE {$$ = $1+' '}
	| CADENA {$$ = $1+' '}
	| CARACTER {$$ = $1+' '}
	| ID {$$ = $1+' '}
	| acceso_vector {$$ = $1+' '}
	| acceso_lista {$$ = $1+' '}
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
	: instrucciones_globales instruccion_global {$1.push($2); $$ = $1}
	| instruccion_global 						{$$ = [$1+'']}
;

instrucciones_locales
	: instrucciones_locales instruccion_local  	{$$ = $1+' '+$2}
	| instruccion_local							{$$ = $1+''}
;

instruccion_local
	: instruccion_local_metodo		{$$ = $1+''}				
	| CONTINUE PUNTOCOMA			{$$ = $1+' '+$2}
	| BREAK PUNTOCOMA				{$$ = $1+' '+$2}
;

instrucciones_locales_metodo
	: instruccion_local_metodo instrucciones_locales_metodo {$$ = $1+' '+$2}
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
	| RETURN condicion_logica PUNTOCOMA {$$ = $1+' '+$2+' '+$3}
	| RETURN PUNTOCOMA				{$$ = $1+' '+$2}
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
	| ASIGNACION condicion_logica PUNTOCOMA 							{$$ = $1+' '+$2+' '+$3}
	| ASIGNACION TO_UPPER PARENTESIS_A CADENA PARENTESIS_C PUNTOCOMA 	{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION TO_UPPER PARENTESIS_A ID PARENTESIS_C PUNTOCOMA 		{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION TO_LOWER PARENTESIS_A CADENA PARENTESIS_C PUNTOCOMA 	{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION TO_LOWER PARENTESIS_A ID PARENTESIS_C PUNTOCOMA 		{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION PARENTESIS_A INT PARENTESIS_C expresion PUNTOCOMA 		{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION PARENTESIS_A CHAR PARENTESIS_C expresion PUNTOCOMA 	{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION PARENTESIS_A DOUBLE PARENTESIS_C expresion PUNTOCOMA 	{$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| ASIGNACION metodos_nativos PUNTOCOMA 								{$$ = $1+' '+$2+' '+$3}
	| ASIGNACION condicion_logica TERNARIO expresion DOSPUNTOS expresion PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
;

asignacion_valor_vector
	: ASIGNACION NEW asignacion_tipo CORCHETE_A ENTERO CORCHETE_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
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
    : FOR PARENTESIS_A ciclo_for_variable condicion_logica PUNTOCOMA ciclo_for_incremento
	PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9}
	| FOR PARENTESIS_A ciclo_for_variable condicion_logica PUNTOCOMA ciclo_for_incremento
	PARENTESIS_C LLAVE_A instrucciones_locales LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9+' '+$10}
;

ciclo_for_variable
	: creacion_variable 	{$$ = $1+''}
	| asignacion_variable 	{$$ = $1+''}
;

ciclo_for_incremento
	: ID ASIGNACION expresion			{$$ = $1+' '+$2+' '+$3}
	| ID DECREMENTO						{$$ = $1+' '+$2}
	| ID INCREMENTO						{$$ = $1+' '+$2}	
;
/*GRAMATICA FOR-------------------------------------------------------------*/


/*GRAMATICA DO WHILE--------------------------------------------------------*/
ciclo_do_while
	: DO LLAVE_A /*instrucciones*/ LLAVE_C WHILE PARENTESIS_A condicion_logica PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+''+$7}
	| DO LLAVE_A instrucciones_locales LLAVE_C WHILE PARENTESIS_A condicion_logica PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+''+$7+''+$8}
;

ciclo_while_condicion
	: condiciones_logicas PARENTESIS_C  {$$ = $1+' '+$2}
	| ID PARENTESIS_C 					{$$ = $1+' '+$2}
	| TRUE PARENTESIS_C 				{$$ = $1+' '+$2}
;
/*GRAMATICA DO WHILE--------------------------------------------------------*/


/*GRAMATICA WHILE-----------------------------------------------------------*/
ciclo_while
	:	WHILE PARENTESIS_A condicion_logica LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	|	WHILE PARENTESIS_A condicion_logica LLAVE_A instrucciones_locales LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;
/*GRAMATICA WHILE-----------------------------------------------------------*/


/*GRAMATICA IF ELSE---------------------------------------------------------*/
condicion_if
	: IF PARENTESIS_A condicion_logica  LLAVE_A instrucciones_locales LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| IF PARENTESIS_A condicion_logica  LLAVE_A  LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	| IF PARENTESIS_A condicion_logica  LLAVE_A instrucciones_locales LLAVE_C condicion_if_else {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| IF PARENTESIS_A condicion_logica  LLAVE_A LLAVE_C condicion_if_else {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;

condicion_if_else
	: ELSE LLAVE_A instrucciones_locales LLAVE_C 	{$$ = $1+' '+$2+' '+$3+' '+$4}
	| ELSE LLAVE_A LLAVE_C 							{$$ = $1+' '+$2+' '+$3}
	| ELSE condicion_if 							{$$ = $1+' '+$2}
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
	| CASE ENTERO DOSPUNTOS instrucciones_locales {$$ = $1+' '+$2+' '+$3+' '+$4}
	//| DEFAULT DOSPUNTOS /*instrucciones*/ BREAK PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
	| DEFAULT DOSPUNTOS /*instrucciones*/		{$$ = $1+' '+$2}
	| DEFAULT DOSPUNTOS instrucciones_locales	{$$ = $1+' '+$2+' '+$3}
;
/*GRAMATICA SWITCH----------------------------------------------------------*/



/*MANEJO DE LISTAS Y VECTORES-----------------------------------------------*/
manejo_vector_lista
	: asignacion_tipo CORCHETE_A CORCHETE_C ID ASIGNACION NEW asignacion_tipo CORCHETE_A ENTERO CORCHETE_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9+' '+$10+' '+$11}
	| asignacion_tipo CORCHETE_A CORCHETE_C ID ASIGNACION LLAVE_A elementos_coma LLAVE_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9}
	//| acceso_vector ASIGNACION operacion_aritmetica PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
	| LISTA MENOR asignacion_tipo MAYOR ID ASIGNACION NEW LISTA MENOR asignacion_tipo MAYOR PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9+' '+$10+' '+$11+' '+$12}
	| ID PUNTO ADD PARENTESIS_A expresion PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	//| acceso_lista ASIGNACION operacion_aritmetica PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
;

elementos_coma
	: expresion COMA elementos_coma {$$ = $1+' '+$2+' '+$3}
	| expresion 					{$$ = $1+' '}
;

acceso_vector
	: ID CORCHETE_A ENTERO CORCHETE_C {$$ = $1+' '+$2+' '+$3+' '+$4}
;

acceso_lista
	: ID CORCHETE_A CORCHETE_A ENTERO CORCHETE_C CORCHETE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;
/*MANEJO DE LISTAS Y VECTORES-----------------------------------------------*/


/*GRAMATICA METODOS Y FUNCIONES---------------------------------------------*/
declaracion_funcion_metodo
	: asignacion_tipo ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| asignacion_tipo ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A instrucciones_locales_metodo LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8}
	| asignacion_tipo ID PARENTESIS_A PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| asignacion_tipo ID PARENTESIS_A PARENTESIS_C LLAVE_A instrucciones_locales_metodo LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| VOID ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| VOID ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A instrucciones_locales_metodo LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8}
	| VOID ID PARENTESIS_A PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| VOID ID PARENTESIS_A PARENTESIS_C LLAVE_A instrucciones_locales_metodo LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
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
	| EXEC ID PARENTESIS_A PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
;
/*LLAMADAS A METODO Y FUNCIONES INCLUYENDO EXEC Y PRINT---------------------*/