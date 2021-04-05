back up



gramatica para el if else con condiciones, el problema es que acepta 5 && 5, tendrá que ser error semántico
acepta tambien por ejemplo if (5)

/*GRAMATICA IF ELSE---------------------------------------------------------*/
condicion_if
	: IF PARENTESIS_A condiciones_logicas PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| IF PARENTESIS_A condiciones_logicas PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C condicion_if_else {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
;

condicion_if_else
	: ELSE LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3}
	| ELSE condicion_if {$$ = $1+' '+$2}
;
/*GRAMATICA IF ELSE---------------------------------------------------------*/



/*GRAMATICA WHILE-----------------------------------------------------------*/
ciclo_while
	:	WHILE PARENTESIS_A condiciones_logicas PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;
/*GRAMATICA WHILE-----------------------------------------------------------*/



/*GRAMATICA SWITCH----------------------------------------------------------*/
condicion_switch
	: SWITCH PARENTESIS_A ID PARENTESIS_C LLAVE_A condiciones_case_switch LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
;

condiciones_case_switch
	: condicion_case condiciones_case_switch {$$ = $1+' '+$2}
	| condicion_case {$$ = $1+''}
;

condicion_case
	//: CASE ENTERO DOSPUNTOS /*instrucciones*/ BREAK PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	: CASE ENTERO DOSPUNTOS /*instrucciones*/{$$ = $1+' '+$2+' '+$3}
	//| DEFAULT DOSPUNTOS /*instrucciones*/ BREAK PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
	| DEFAULT DOSPUNTOS /*instrucciones*/{$$ = $1+' '+$2}
;
/*GRAMATICA SWITCH----------------------------------------------------------*/






/*GRAMATICA FOR-------------------------------------------------------------*/
ciclo_for
    : FOR PARENTESIS_A ciclo_for_variable ID operadores_comparacion expresion PUNTOCOMA ciclo_for_incremento
	  PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9+' '+$10+' '+$11}
;

ciclo_for_variable
	: creacion_variable {$$ = $1+''}
	| asignacion_variable {$$ = $1+''}
;

ciclo_for_incremento
	: asignacion_variable_for {$$ = $1+''}
	| expresion_incremento {$$ = $1+''}
	
;

asignacion_variable_for
	: ID ASIGNACION operacion_aritmetica{$$ = $1+' '+$2+' '+$3}
	
;
/*GRAMATICA FOR-------------------------------------------------------------*/




/*GRAMATICA DO WHILE--------------------------------------------------------*/
ciclo_do_while
	: DO LLAVE_A /*instrucciones*/ LLAVE_C WHILE PARENTESIS_A condicion_logica PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8}
;
/*GRAMATICA DO WHILE--------------------------------------------------------*/


/*GRAMATICA METODOS Y FUNCIONES---------------------------------------------*/
declaracion_funcion_metodo
	: asignacion_tipo ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| asignacion_tipo ID PARENTESIS_A PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
	| VOID ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| VOID ID PARENTESIS_A PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;

definicion_parametros
	: asignacion_tipo ID COMA definicion_parametros {$$ = $1+' '+$2+' '+$3+' '+$4}
	| asignacion_tipo ID {$$ = $1+' '+$2}
;
/*GRAMATICA METODOS Y FUNCIONES---------------------------------------------*/



/*GRAMATICA ASIGNACION VARIABLE---------------------------------------------*/
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


asignacion_tipo
	: INT {$$ = $1+''}	
	| BOOLEAN {$$ = $1+''}	
	| STRING {$$ = $1+''}	
	| DOUBLE {$$ = $1+''}	
	| CHAR {$$ = $1+''}	
;
/*GRAMATICA ASIGNACION VARIABLE---------------------------------------------*/




/*GRAMATICA OPERACIONES LÓGICAS Y ARITMÉTICAS-------------------------------*/
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

expresion_incremento
	: ID MENOS MENOS			{$$ = $1+' '+$2+' '+$3}
	| ID MAS MAS				{$$ = $1+' '+$2+' '+$3}
;
/*GRAMATICA OPERACIONES LÓGICAS Y ARITMÉTICAS-------------------------------*/


/*LLAMADAS A METODO Y FUNCIONES INCLUYENDO EXEC Y PRINT---------------------*/
llamada_metodo_funcion
	: ID PARENTESIS_A elementos_coma PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	| ID PARENTESIS_C PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
	| PRINT PARENTESIS_A CADENA PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	| EXEC ID PARENTESIS_A elementos_coma PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+''+$6}
	| EXEC ID PARENTESIS_A PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
;
/*LLAMADAS A METODO Y FUNCIONES INCLUYENDO EXEC Y PRINT---------------------*/




/*MANEJO DE LISTAS Y VECTORES-----------------------------------------------*/

manejo_vector_lista
	: asignacion_tipo CORCHETE_A CORCHETE_C ID ASIGNACION NEW asignacion_tipo CORCHETE_A numero CORCHETE_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9+' '+$10+' '+$11}
	| asignacion_tipo CORCHETE_A CORCHETE_C ID ASIGNACION LLAVE_A elementos_coma LLAVE_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9}
	| acceso_vector ASIGNACION operacion_aritmetica PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
	| LISTA MENOR asignacion_tipo MAYOR ID ASIGNACION NEW LISTA MENOR asignacion_tipo MAYOR PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7+' '+$8+' '+$9+' '+$10+' '+$11+' '+$12}
	| ID PUNTO ADD PARENTESIS_A operacion_aritmetica PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6+' '+$7}
	| acceso_lista ASIGNACION operacion_aritmetica PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
;

elementos_coma
	: expresion COMA elementos_coma {$$ = $1+' '+$2+' '+$3}
	| expresion {$$ = $1}
;

acceso_vector
	: ID CORCHETE_A numero CORCHETE_C {$$ = $1+' '+$2+' '+$3+' '+$4}
;

acceso_lista
	: ID CORCHETE_A CORCHETE_A numero CORCHETE_C CORCHETE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;


/*MANEJO DE LISTAS Y VECTORES-----------------------------------------------*/



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






node index.js





