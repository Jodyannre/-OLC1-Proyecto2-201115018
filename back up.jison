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

condiciones_logicas
	: condicion_logica OR condiciones_logicas {$$ = $1+' '+$2+' '+$3}
	| condicion_logica AND condiciones_logicas {$$ = $1+' '+$2+' '+$3}
	| condicion_logica {$$ = $1+''}	
;

condicion_logica		
	: expresion MAYOR_I expresion {$$ = $1+' '+$2+' '+$3}
	| expresion MENOR_I expresion {$$ = $1+' '+$2+' '+$3}
	| expresion DIFERENTE expresion {$$ = $1+' '+$2+' '+$3}
	| expresion IGUAL expresion {$$ = $1+' '+$2+' '+$3}
	| expresion MAYOR expresion  {$$ = $1+' '+$2+' '+$3}
	| expresion MENOR expresion  {$$ = $1+' '+$2+' '+$3}
	| expresion {$$ = $1+''}
;

expresion
	: ENTERO {$$ = $1+''}
	| DECIMAL {$$ = $1+''}	
	| ID {$$ = $1+''}
	| NOT ID {$$ = $1+' '+$2}	
;
/*GRAMATICA IF ELSE---------------------------------------------------------*/



/*GRAMATICA WHILE-----------------------------------------------------------*/

ciclo_while
	:	WHILE PARENTESIS_A condiciones_logicas PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5+' '+$6}
;


/*GRAMATICA WHILE-----------------------------------------------------------*/



/*GRAMATICA FOR-------------------------------------------------------------*/

ciclo_for
    :
;



/*GRAMATICA FOR-------------------------------------------------------------*/




/*GRAMATICA ASIGNACION VARIABLE---------------------------------------------*/

asignacion_variable
	: asignacion_tipo ID asignacion_valor_variable {$$ = $1+' '+$2+' '+$3}
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
;

asignacion_tipo
	: INT {$$ = $1+''}	
	| BOOLEAN {$$ = $1+''}	
	| STRING {$$ = $1+''}	
	| DOUBLE {$$ = $1+''}	
	| CHAR {$$ = $1+''}	
;

/*GRAMATICA ASIGNACION VARIABLE---------------------------------------------*/


node index.js





condicion_aritmetica	
	: MENOS expresion %prec UMENOS operador_de_condicion_aritmetica { $$ = 'Neg '+$2+$3}	
	| expresion operador_de_condicion_aritmetica		
;
operador_de_condicion_aritmetica
	: MAS expresion {$$ = $1+' '+$2+' '+$3}
	| MENOS expresion {$$ = $1+' '+$2+' '+$3}
	| DIV expresion {$$ = $1+' '+$2+' '+$3}
	| POR expresion {$$ = $1+' '+$2+' '+$3}
	| POTENCIA expresion {$$ = $1+' '+$2+' '+$3}
	| MOD expresion {$$ = $1+' '+$2+' '+$3}	
;


