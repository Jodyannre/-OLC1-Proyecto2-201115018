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
"\""[^\n\r"\""|"\\\\""\""]*"\""	{yytext = yytext.substr(1,(yyleng-2)); return "CADENA";}
"'"[^\n\r]?"'"		{yytext = yytext.substr(1,(yyleng-2)); return "CARACTER";}
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
[a-z]([a-z]|[0-9]|"_")*     			return 'ID';
[0-9]+("."[0-9]+)\b    					return 'DECIMAL';
[0-9]+\b    							return 'ENTERO';
/*--------------------------------------------------------*/


<<EOF>>                 return 'EOF';

.                       { return 'EXCEPCION' }
/lex



%{
    const Excepcion = require('../Excepciones/Excepcion');
    const Tipo = require('../tablaSimbolos/Tipo');
    const Arbol = require('../tablaSimbolos/Arbol');
    const Primitivo = require('../Expresiones/Primitivo');
    const Imprimir = require('../Instrucciones/Imprimir');
	const Aritmetica = require('../Expresiones/Aritmetica');
	const Relacional = require('../Expresiones/Relacional');
	const Logica = require('../Expresiones/Logica');
	const Identificador = require('../Expresiones/Identificador');
	const Declaracion = require('../Expresiones/Declaracion');
	const Vector = require('../Expresiones/Vector');
	const Lista = require('../Expresiones/Lista');
	const Funcion = require('../Expresiones/Funcion');
	const Metodo = require('../Expresiones/Metodo');
	const Ternario = require('../Expresiones/Ternario');
	const Parametro = require('../Expresiones/Parametro');
	const toUpper = require('../Instrucciones/toUpper');
	const toLower = require('../Instrucciones/toLower');
	const Length = require('../Instrucciones/Length');
	const Truncate = require('../Instrucciones/Truncate');
	const Round = require('../Instrucciones/Round');
	const Typeof = require('../Instrucciones/Typeof');
	const ToString = require('../Instrucciones/toString');
	const ToCharArray = require('../Instrucciones/toCharArray');
	const Casteo = require('../Instrucciones/Casteo');
	const Exec = require('../Instrucciones/Exec');
	const llamadaFuncion = require('../Instrucciones/llamadaFuncion');
	const llamadaArray = require('../Instrucciones/llamadaArray');
	const Asignacion = require('../Expresiones/Asignacion');
	const Agrupacion = require('../Expresiones/Agrupacion');
	const IF = require('../Sentencias/IF');
	const ELSE = require('../Sentencias/ELSE');
	const WHILE = require('../Sentencias/WHILE');
	const DO_WHILE = require('../Sentencias/DO_WHILE');
	const SWITCH = require('../Sentencias/SWITCH');
	const CASE = require('../Sentencias/CASE');
	const BREAK = require('../Sentencias/BREAK');
	const CONTINUE = require('../Sentencias/CONTINUE');
	const RETURN = require('../Sentencias/RETURN');
	const FOR = require('../Sentencias/FOR');
	var pilaAuxiliar = [];
	function crearVector(tipo,linea,columna,id,size,tipo_creacion,valor){
		var nuevoVector = new Vector.default(tipo,linea,columna,id,parseInt(size),tipo_creacion,valor);
		//pilaAuxiliar = [];
		return nuevoVector;
	}
	function crearToUpper(expresion, linea, columna, retorno){
		var nuevoNodo = new toUpper.default(expresion, linea, columna, retorno);
		//pilaAuxiliar = [];
		return nuevoNodo;
	}
	function crearToLower(expresion, linea, columna, retorno){
		var nuevoNodo = new toLower.default(expresion, linea, columna, retorno);
		//pilaAuxiliar = [];
		return nuevoNodo;
	}
	function crearLength(expresion, linea, columna, retorno){
		var nuevoNodo = new Length.default(expresion, linea, columna, retorno);
		//pilaAuxiliar = [];
		return nuevoNodo;
	}
	function crearTruncate(expresion, linea, columna, retorno){
		var nuevoNodo = new Truncate.default(expresion, linea, columna, retorno);
		//pilaAuxiliar = [];
		return nuevoNodo;
	}
	function crearRound(expresion, linea, columna, retorno){
		var nuevoNodo = new Round.default(expresion, linea, columna, retorno);
		//pilaAuxiliar = [];
		return nuevoNodo;
	}
	function crearTypeof(expresion, linea, columna, retorno){
		var nuevoNodo = new Typeof.default(expresion, linea, columna, retorno);
		//pilaAuxiliar = [];
		return nuevoNodo;
	}
	function crearToString(expresion, linea, columna, retorno){
		var nuevoNodo = new ToString.default(expresion, linea, columna, retorno);
		//pilaAuxiliar = [];
		return nuevoNodo;
	}
	function crearToCharArray(expresion, linea, columna, retorno){
		var nuevoNodo = new ToCharArray.default(expresion, linea, columna, retorno);
		//pilaAuxiliar = [];
		return nuevoNodo;
	}
	function crearAsignacion(id,linea,columna,instruccion){
		var tipo = new Tipo.default(Tipo.tipos.ASIGNACION);
		var nuevaAsignacion = new Asignacion.default(id,tipo,linea,columna,instruccion);
		//pilaAuxiliar = [];
		return nuevaAsignacion;
	}	
%}

/* Asociación de operadores y precedencia */

%left 'TERNARIO'
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
	: instrucciones_globales EOF {return $1}
;




/*GRAMATICA OPERACIONES LÓGICAS Y ARITMÉTICAS-------------------------------*/
condicion_logica
	: condicion_logica AND condicion_logica {$$ = new Logica.default($1,new Tipo.default(Tipo.tipos.AND),@1.first_line, @1.first_column,$3); }
	| condicion_logica OR condicion_logica {$$ = new Logica.default($1,new Tipo.default(Tipo.tipos.OR),@1.first_line, @1.first_column,$3); }
	| NOT condicion_logica {$$ = new Logica.default($2,new Tipo.default(Tipo.tipos.NOT),@1.first_line, @1.first_column); }
	| relacional {$$ = $1}
;

relacional
	: relacional MAYOR_I relacional {$$ = new Relacional.default($1,$3,new Tipo.default(Tipo.tipos.MAYOR_I),@1.first_line, @1.first_column,$1); }
	| relacional MENOR_I relacional {$$ = new Relacional.default($1,$3,new Tipo.default(Tipo.tipos.MENOR_I),@1.first_line, @1.first_column,$1); }
	| relacional IGUAL relacional {$$ = new Relacional.default($1,$3,new Tipo.default(Tipo.tipos.IGUAL),@1.first_line, @1.first_column,$1); }
	| relacional MENOR relacional {$$ = new Relacional.default($1,$3,new Tipo.default(Tipo.tipos.MENOR),@1.first_line, @1.first_column,$1); }
	| relacional MAYOR relacional {$$ = new Relacional.default($1,$3,new Tipo.default(Tipo.tipos.MAYOR),@1.first_line, @1.first_column,$1); }
	| relacional DIFERENTE relacional {$$ = new Relacional.default($1,$3,new Tipo.default(Tipo.tipos.DIFERENTE),@1.first_line, @1.first_column,$1); }
	| expresion {$$ = $1}
;

instruccionTemp
	: instrucciones_globales 				{$$ = $1}
	//: instrucciones_locales				{$$ = $1}
;

expresion
	: expresion POTENCIA expresion {$$ = new Aritmetica.default($3,new Tipo.default(Tipo.tipos.POTENCIA),@1.first_line, @1.first_column,$1); }
	| expresion POR expresion {$$ = new Aritmetica.default($3,new Tipo.default(Tipo.tipos.MULTIPLICACION),@1.first_line, @1.first_column,$1); }
	| expresion MOD expresion {$$ = new Aritmetica.default($3,new Tipo.default(Tipo.tipos.MODULO),@1.first_line, @1.first_column,$1); }	
	| expresion DIV expresion {$$ = new Aritmetica.default($3,new Tipo.default(Tipo.tipos.DIVISION),@1.first_line, @1.first_column,$1); }
	| expresion MENOS expresion {$$ = new Aritmetica.default($3,new Tipo.default(Tipo.tipos.RESTA),@1.first_line, @1.first_column,$1); }	
	| expresion MAS expresion {$$ = new Aritmetica.default($3,new Tipo.default(Tipo.tipos.SUMA),@1.first_line, @1.first_column,$1); }
	| MENOS expresion %prec UMENOS {$$ = new Aritmetica.default($2,new Tipo.default(Tipo.tipos.NEGACION),@1.first_line, @1.first_column); }
	| expresion INCREMENTO  {$$ = new Aritmetica.default($1,new Tipo.default(Tipo.tipos.INCREMENTO),@1.first_line, @1.first_column); }
	| expresion DECREMENTO  {$$ = new Aritmetica.default($1,new Tipo.default(Tipo.tipos.DECREMENTO),@1.first_line, @1.first_column); }
	| PARENTESIS_A condicion_logica PARENTESIS_C {$$ = new Agrupacion.default(new Tipo.default(Tipo.tipos.AGRUPACION),@1.first_line, @1.first_column,$2); }
	| ENTERO {$$ = new Primitivo.default( new Tipo.default(Tipo.tipos.ENTERO),parseInt($1,10), @1.first_line, @1.first_column); }
	| DECIMAL { $$ = new Primitivo.default( new Tipo.default(Tipo.tipos.DECIMAL),parseFloat($1), @1.first_line, @1.first_column); }
	| TRUE { $$ = new Primitivo.default( new Tipo.default(Tipo.tipos.BOOLEANO),true, @1.first_line, @1.first_column); }
	| FALSE { $$ = new Primitivo.default( new Tipo.default(Tipo.tipos.BOOLEANO),false, @1.first_line, @1.first_column); }
	| CADENA { $$ = new Primitivo.default( new Tipo.default(Tipo.tipos.CADENA),$1, @1.first_line, @1.first_column); }
	| CARACTER { $$ = new Primitivo.default( new Tipo.default(Tipo.tipos.CARACTER),$1, @1.first_line, @1.first_column); }
	| ID {$$ = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1, @1.first_line, @1.first_column); }
	| acceso_vector {$$ = $1}
	| acceso_lista {$$ = $1}
	| llamada_metodo_funcion {$$ = $1}
	| metodos_nativos {$$ = $1}
; 
/*GRAMATICA OPERACIONES LÓGICAS Y ARITMÉTICAS-------------------------------*/



/*METODOS NATIVOS-----------------------------------------------------------*/
metodos_nativos
	: LENGTH PARENTESIS_A expresion PARENTESIS_C 		
	{
		var tipo = new Tipo.default(Tipo.tipos.ENTERO); 
		var nodo = crearLength($3, @1.first_line, @1.first_column, tipo);
		$$ = nodo;
	}
	| TRUNCATE PARENTESIS_A expresion PARENTESIS_C		
	{
		var tipo = new Tipo.default(Tipo.tipos.ENTERO); 
		var nodo = crearTruncate($3, @1.first_line, @1.first_column, tipo);
		$$ = nodo;		
	}
	| TYPEOF PARENTESIS_A expresion PARENTESIS_C		
	{
		var tipo = new Tipo.default(Tipo.tipos.CADENA); 
		var nodo = crearTypeof($3, @1.first_line, @1.first_column, tipo);
		$$ = nodo;			
	}
	| TO_STRING PARENTESIS_A expresion PARENTESIS_C			
	{
		var tipo = new Tipo.default(Tipo.tipos.CADENA); 
		var nodo = crearToString($3, @1.first_line, @1.first_column, tipo);
		$$ = nodo;			
	}
	| TO_CHAR_ARRAY PARENTESIS_A expresion PARENTESIS_C	
	{
		var tipo = new Tipo.default(Tipo.tipos.LISTA); 
		var nodo = crearToCharArray($3, @1.first_line, @1.first_column, tipo);
		$$ = nodo;		
	}
	| ROUND PARENTESIS_A expresion PARENTESIS_C			
	{
		var tipo = new Tipo.default(Tipo.tipos.ENTERO); 
		var nodo = crearRound($3, @1.first_line, @1.first_column, tipo);
		$$ = nodo;		
	}
	| TO_UPPER PARENTESIS_A condicion_logica PARENTESIS_C  	
	{
		var tipo = new Tipo.default(Tipo.tipos.CADENA); 
		var nodo = crearToUpper($3, @1.first_line, @1.first_column, tipo);
		$$ = nodo;
	}
	| TO_LOWER PARENTESIS_A condicion_logica PARENTESIS_C  	
	{
		var tipo = new Tipo.default(Tipo.tipos.CADENA); 
		var nodo = crearToLower($3, @1.first_line, @1.first_column, tipo);
		$$ = nodo;
	}
;
/*METODOS NATIVOS-----------------------------------------------------------*/


/*GRAMATICA ASIGNACION VARIABLE---------------------------------------------*/
instrucciones_globales
	: instrucciones_globales instruccion_global 
	{
		$1.push($2); 
		$$ = $1
	}
	| instruccion_global {$$ = [$1]}
;

instrucciones_locales
	: instrucciones_locales instruccion_local
	{
		//$1 = [$1];
		$1.push($2);
		$$ = $1;
	}  	
	| instruccion_local	{$$ = [$1]}
;

instruccion_local
	: instruccion_local_metodo		{$$ = $1}				
	| CONTINUE PUNTOCOMA			
	{
		var nTipo = new Tipo.default(Tipo.tipos.CONTINUE);
		var nContinue = new CONTINUE.default(nTipo,@1.first_line, @1.first_column);
		$$ = nContinue;
	}
	| BREAK PUNTOCOMA				
	{
		var nTipo = new Tipo.default(Tipo.tipos.BREAK);
		var nBreak = new BREAK.default(nTipo,@1.first_line, @1.first_column);
		$$ = nBreak;
	}
;

instrucciones_locales_metodo
	: instrucciones_locales_metodo  instruccion_local_metodo 
	{
		//$1 = [$1];
		$1.push($2);
		$$ = $1;
	}
	| instruccion_local_metodo 	{$$ = [$1]}
;

instruccion_local_metodo
	: creacion_variable 			{$$ = $1}
	| asignacion_variable 			{$$ = $1}
	| manejo_vector_lista			{$$ = $1}
	| ciclo_for						{$$ = $1}
	| ciclo_do_while				{$$ = $1}
	| ciclo_while					{$$ = $1}
	| condicion_if					{$$ = $1}
	| condicion_switch				{$$ = $1}
	| aritmetico_unario				{$$ = $1}
	| llamada_metodo_funcion PUNTOCOMA 		{$$ = $1}
	| RETURN condicion_logica PUNTOCOMA 
	{
		var nTipo = new Tipo.default(Tipo.tipos.RETURN);
		var nReturn = new RETURN.default(nTipo,@1.first_line, @1.first_column,$2);
		$$ = nReturn;			
	}
	| RETURN PUNTOCOMA				
	{
		var nTipo = new Tipo.default(Tipo.tipos.RETURN);
		var nReturn = new RETURN.default(nTipo,@1.first_line, @1.first_column,null);
		$$ = nReturn;		
	}
	| EXCEPCION {
		$$ = new Excepcion.default("Error léxico", "El elemento no pertenece al lenguaje.", @1.first_line, @1.first_column);
	}
	| error PUNTOCOMA
	{
		$$ = new Excepcion.default("Error Sintáctico", "El elemento no cumple con las reglas sintácticas.", @1.first_line, @1.first_column);
	}	
;

instruccion_global 
	: creacion_variable 			{$$ = $1}
	| asignacion_variable 			{$$ = $1}
	| manejo_vector_lista			{$$ = $1}
	| ciclo_for						{$$ = $1}
	| ciclo_do_while				{$$ = $1}
	| ciclo_while					{$$ = $1}
	| condicion_if					{$$ = $1}
	| condicion_switch				{$$ = $1}
	//| declaracion_funcion_metodo 	{$$ = $1}
	| aritmetico_unario				{$$ = $1}
	| llamada_metodo_funcion PUNTOCOMA 		{$$ = $1}
	| EXCEPCION {
		$$ = new Excepcion.default("Error léxico", "El elemento no pertenece al lenguaje.", @1.first_line, @1.first_column);
	}
	| error PUNTOCOMA
	{
		$$ = new Excepcion.default("Error Sintáctico", "El elemento no cumple con las reglas sintácticas.", @1.first_line, @1.first_column);
	}	
;

creacion_variable
	: asignacion_tipo asignacion_variable 	{
											var id = $2.getId();
											//var idNodo = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),id,@1.first_line, @1.first_column);
											$$ = new Declaracion.default(id,$1,@1.first_line, @1.first_column,$2,null);
											}
	| declaracion_funcion_metodo
	{
		var id = $1.getId_Obj();
		var nTipo = new Tipo.default($1.getTipoRetorno());
		//var idNodo = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),id,@1.first_line, @1.first_column);
		$$ = new Declaracion.default(id,nTipo,@1.first_line, @1.first_column,$1,null);
	}
;

asignacion_variable
	: ID asignacion_valor_variable 				
	{ 
		var id = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1, @1.first_line, @1.first_column); 
		var asignacion = crearAsignacion(id,@1.first_line, @1.first_column,$2);
		$$ = asignacion;
	}
	//| acceso_lista asignacion_valor_variable 	{$$ = $1+' '+$2}
	//| acceso_vector asignacion_valor_variable 	{$$ = $1+' '+$2}	
;

asignacion_valor_variable
	: PUNTOCOMA 																{$$ = null;}	
	| ASIGNACION condicion_logica PUNTOCOMA 									{$$ = $2;}
	| ASIGNACION PARENTESIS_A INT PARENTESIS_C condicion_logica PUNTOCOMA 		
	{
		var tipo = new Tipo.default(Tipo.tipos.ENTERO); 
		var nodo = new Casteo.default(tipo,$5,@1.first_line, @1.first_column);
		$$ = nodo;		
	}
	| ASIGNACION PARENTESIS_A CHAR PARENTESIS_C condicion_logica PUNTOCOMA 	
	{
		var tipo = new Tipo.default(Tipo.tipos.CARACTER); 
		var nodo = new Casteo.default(tipo,$5,@1.first_line, @1.first_column);;
		$$ = nodo;
	}
	| ASIGNACION PARENTESIS_A DOUBLE PARENTESIS_C condicion_logica PUNTOCOMA 	
	{
		var tipo = new Tipo.default(Tipo.tipos.DECIMAL); 
		var nodo = new Casteo.default(tipo,$5,@1.first_line, @1.first_column);
		$$ = nodo;
	}
	| ASIGNACION condicion_logica TERNARIO condicion_logica DOSPUNTOS condicion_logica PUNTOCOMA 
	{
		$$ = new Ternario.default(new Tipo.default(Tipo.tipos.TERNARIO),$2,$4,$6,@1.first_line, @1.first_column);
	}
;

asignacion_tipo
	: INT 		{$$ = new Tipo.default(Tipo.tipos.ENTERO); }	
	| BOOLEAN 	{$$ = new Tipo.default(Tipo.tipos.BOOLEANO); }	
	| STRING 	{$$ = new Tipo.default(Tipo.tipos.CADENA); }	
	| DOUBLE 	{$$ = new Tipo.default(Tipo.tipos.DECIMAL); }	
	| CHAR 		{$$ = new Tipo.default(Tipo.tipos.CARACTER); }	
;
/*GRAMATICA ASIGNACION VARIABLE---------------------------------------------*/


/*GRAMATICA FOR-------------------------------------------------------------*/
ciclo_for
    : FOR PARENTESIS_A ciclo_for_variable  condicion_logica PUNTOCOMA ciclo_for_incremento
	PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C 
	{
		var nTipo = new Tipo.default(Tipo.tipos.FOR);
		var nFor = new FOR.default(nTipo,@1.first_line, @1.first_column,$3,$4,$6,null);
		$$ = nFor;
	}
	| FOR PARENTESIS_A ciclo_for_variable  condicion_logica PUNTOCOMA ciclo_for_incremento
	PARENTESIS_C LLAVE_A instrucciones_locales LLAVE_C 
	{
		var nTipo = new Tipo.default(Tipo.tipos.FOR);
		var nFor = new FOR.default(nTipo,@1.first_line, @1.first_column,$3,$4,$6,$9);
		$$ = nFor;
	}


	
;

ciclo_for_variable
	: creacion_variable 	{$$ = $1;}
	| asignacion_variable 	{$$ = $1;}
;

ciclo_for_incremento
	: ID DECREMENTO			
	{
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1,@1.first_line, @1.first_column);
		$$ = new Aritmetica.default(id,new Tipo.default(Tipo.tipos.DECREMENTO),@1.first_line, @1.first_column); 
	}
	| ID INCREMENTO			
	{
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1,@1.first_line, @1.first_column);
		$$ = new Aritmetica.default(id,new Tipo.default(Tipo.tipos.INCREMENTO),@1.first_line, @1.first_column); 
	}
	| ID ASIGNACION condicion_logica {$$ = $3;}	
;




aritmetico_unario
	//: ID ASIGNACION expresion					{$$ = $1+' '+$2+' '+$3}
	: ID DECREMENTO	PUNTOCOMA			
	{
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1,@1.first_line, @1.first_column);
		$$ = new Aritmetica.default(id,new Tipo.default(Tipo.tipos.DECREMENTO),@1.first_line, @1.first_column); 
	}
	| ID INCREMENTO PUNTOCOMA			
	{
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1,@1.first_line, @1.first_column);
		$$ = new Aritmetica.default(id,new Tipo.default(Tipo.tipos.INCREMENTO),@1.first_line, @1.first_column); 
	}	

;
/*GRAMATICA FOR-------------------------------------------------------------*/


/*GRAMATICA DO WHILE--------------------------------------------------------*/
ciclo_do_while
	: DO LLAVE_A /*instrucciones*/ LLAVE_C WHILE PARENTESIS_A condicion_logica PARENTESIS_C PUNTOCOMA 
	{
		var tipo = new Tipo.default(Tipo.tipos.DO_WHILE);
		var nuevoCiclo = new DO_WHILE.default(tipo,@1.first_line, @1.first_column,$6,null);
		$$ = nuevoCiclo;
	}
	| DO LLAVE_A instrucciones_locales LLAVE_C WHILE PARENTESIS_A condicion_logica PARENTESIS_C PUNTOCOMA 
	{
		var tipo = new Tipo.default(Tipo.tipos.DO_WHILE);
		var nuevoCiclo = new DO_WHILE.default(tipo,@1.first_line, @1.first_column,$7,$3);
		$$ = nuevoCiclo;
	}
;

/*GRAMATICA DO WHILE--------------------------------------------------------*/


/*GRAMATICA WHILE-----------------------------------------------------------*/
ciclo_while
	//:	WHILE PARENTESIS_A condicion_logica LLAVE_A /*instrucciones*/ LLAVE_C {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	:	WHILE PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A instrucciones_locales LLAVE_C 
	{
		var tipo = new Tipo.default(Tipo.tipos.WHILE);
		var nuevoCiclo = new WHILE.default(tipo,@1.first_line, @1.first_column,$3,$6);
		$$ = nuevoCiclo;
	}
;
/*GRAMATICA WHILE-----------------------------------------------------------*/


/*GRAMATICA IF ELSE---------------------------------------------------------*/
condicion_if
	: IF PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A instrucciones_locales LLAVE_C 
	{
		$$ = new IF.default(new Tipo.default(Tipo.tipos.IF),@1.first_line, @1.first_column,$3,$6,null);
		//pilaAuxiliar = [];
	}
	| IF PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A  LLAVE_C 
	{
		$$ = new IF.default(new Tipo.default(Tipo.tipos.IF),@1.first_line, @1.first_column,$3,null,null);
		//pilaAuxiliar = [];
	}
	| IF PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A instrucciones_locales LLAVE_C condicion_else
	{
		//pilaAuxiliar.push($8);
		$$ = new IF.default(new Tipo.default(Tipo.tipos.IF),@1.first_line, @1.first_column,$3,$6,pilaAuxiliar);
		//pilaAuxiliar = [];
	}
	| IF PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A  LLAVE_C condicion_else
	{
		//pilaAuxiliar.push($7);
		$$ = new IF.default(new Tipo.default(Tipo.tipos.IF),@1.first_line, @1.first_column,$3,null,pilaAuxiliar);
		//pilaAuxiliar = [];
	}
	| IF PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A instrucciones_locales LLAVE_C condiciones_if_else condicion_else
	{
		//pilaAuxiliar.push($9)
		$$ = new IF.default(new Tipo.default(Tipo.tipos.IF),@1.first_line, @1.first_column,$3,$6,pilaAuxiliar);
		//pilaAuxiliar = [];
	}
	| IF PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A LLAVE_C condiciones_if_else condicion_else
	{
		//pilaAuxiliar.push($8)
		$$ = new IF.default(new Tipo.default(Tipo.tipos.IF),@1.first_line, @1.first_column,$3,null,pilaAuxiliar); //duda
		//pilaAuxiliar = [];
	}
	| IF PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A instrucciones_locales LLAVE_C condiciones_if_else 
	{
		$$ = new IF.default(new Tipo.default(Tipo.tipos.IF),@1.first_line, @1.first_column,$3,$6,pilaAuxiliar);
		//pilaAuxiliar = [];
	}
	| IF PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A LLAVE_C condiciones_if_else 
	{
		$$ = new IF.default(new Tipo.default(Tipo.tipos.IF),@1.first_line, @1.first_column,$3,null,pilaAuxiliar); //duda
		//pilaAuxiliar = [];
	}
;

condiciones_if_else
	: condiciones_if_else condicion_if_else
	{
		$$ = pilaAuxiliar;
	}
	| condicion_if_else
	{
		$$ = pilaAuxiliar;
	}
;

condicion_else
	: ELSE LLAVE_A instrucciones_locales LLAVE_C 	
	{
		var nuevo = new ELSE.default(new Tipo.default(Tipo.tipos.ELSE),@1.first_line, @1.first_column,$3);
		pilaAuxiliar.push(nuevo);
		$$ = pilaAuxiliar;
	}
	| ELSE LLAVE_A LLAVE_C 							
	{
		var nuevo = new ELSE.default(new Tipo.default(Tipo.tipos.ELSE),@1.first_line, @1.first_column,null);
		pilaAuxiliar.push(nuevo);
		$$ = pilaAuxiliar;
	}
;

condicion_if_else
	: ELSE IF PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A instrucciones_locales LLAVE_C 
	{
		var nuevo = new IF.default(new Tipo.default(Tipo.tipos.ELSE_IF),@1.first_line, @1.first_column,$4,$7,null);
		pilaAuxiliar.push(nuevo);
		$$ = pilaAuxiliar;
	}
	| ELSE IF PARENTESIS_A condicion_logica PARENTESIS_C LLAVE_A  LLAVE_C 
	{
		var nuevo = new IF.default(new Tipo.default(Tipo.tipos.ELSE_IF),@1.first_line, @1.first_column,$4,null,null);
		pilaAuxiliar.push(nuevo);
		$$ = pilaAuxiliar;
	}
;
/*GRAMATICA IF ELSE---------------------------------------------------------*/



/*GRAMATICA SWITCH----------------------------------------------------------*/
condicion_switch
	: SWITCH PARENTESIS_A expresion PARENTESIS_C LLAVE_A condiciones_case_switch LLAVE_C 
	{
		var nTipo = new Tipo.default(Tipo.tipos.SWITCH);
		var nuevoSwitch = new SWITCH.default(nTipo,@1.first_line, @1.first_column,$3,$6);
		$$ = nuevoSwitch;
	}
;

condiciones_case_switch
	: condiciones_case_switch condicion_case  	
	{		
		$1.push($2);
		$$ = $1;
	}
	| condicion_case 							{$$ = [$1];}
;

condicion_case
	//: CASE ENTERO DOSPUNTOS /*instrucciones*/ BREAK PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	: CASE condicion_logica DOSPUNTOS /*instrucciones*/	
	{
		var nTipo = new Tipo.default(Tipo.tipos.CASE);
		var nuevoCase = new CASE.default(nTipo,@1.first_line, @1.first_column,$2,null);
		$$ = nuevoCase;
	}
	| CASE condicion_logica DOSPUNTOS instrucciones_locales 
	{
		var nTipo = new Tipo.default(Tipo.tipos.CASE);
		var nuevoCase = new CASE.default(nTipo,@1.first_line, @1.first_column,$2,$4);
		$$ = nuevoCase;		
	}
	//| DEFAULT DOSPUNTOS /*instrucciones*/ BREAK PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
	| DEFAULT DOSPUNTOS /*instrucciones*/		
	{
		var nTipo = new Tipo.default(Tipo.tipos.DEFAULT);
		var nuevoCase = new CASE.default(nTipo,@1.first_line, @1.first_column,null,null);
		$$ = nuevoCase;			
	}
	| DEFAULT DOSPUNTOS instrucciones_locales	
	{
		var nTipo = new Tipo.default(Tipo.tipos.DEFAULT);
		var nuevoCase = new CASE.default(nTipo,@1.first_line, @1.first_column,null,$3);
		$$ = nuevoCase;			
	}
;
/*GRAMATICA SWITCH----------------------------------------------------------*/



/*MANEJO DE LISTAS Y VECTORES-----------------------------------------------*/
manejo_vector_lista
	: asignacion_tipo CORCHETE_A CORCHETE_C ID ASIGNACION NEW asignacion_tipo CORCHETE_A ENTERO CORCHETE_C PUNTOCOMA {
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$4,@1.first_line, @1.first_column);
		var v = crearVector($1,@1.first_line, @1.first_column,id,$9,$7,null);
		$$ = new Declaracion.default(v.getId(),new Tipo.default(Tipo.tipos.VECTOR),@1.first_line, @1.first_column,v,null);	
		}
	| asignacion_tipo CORCHETE_A CORCHETE_C ID ASIGNACION LLAVE_A elementos_coma LLAVE_C PUNTOCOMA {
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$4,@1.first_line, @1.first_column);
		var v = crearVector($1,@1.first_line, @1.first_column,id,0,$1,$7);
		$$ = new Declaracion.default(v.getId(),new Tipo.default(Tipo.tipos.VECTOR),@1.first_line, @1.first_column,v,null);
		}
	//| acceso_vector ASIGNACION operacion_aritmetica PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4}
	| LISTA MENOR asignacion_tipo MAYOR ID ASIGNACION NEW LISTA MENOR asignacion_tipo MAYOR PUNTOCOMA {
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$5,@1.first_line, @1.first_column);
		var l =  new Lista.default($3,@1.first_line, @1.first_column,id,$10);
		$$ = new Declaracion.default(id,new Tipo.default(Tipo.tipos.LISTA),@1.first_line, @1.first_column,l,null);
		}
	| LISTA MENOR asignacion_tipo MAYOR ID ASIGNACION metodos_nativos PUNTOCOMA
	{	
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$5,@1.first_line, @1.first_column);
		var l =  new Lista.default($3,@1.first_line, @1.first_column,id,new Tipo.default(Tipo.tipos.CARACTER));
		var asignacion = crearAsignacion(id,@1.first_line, @1.first_column,$7);
		$$ = new Declaracion.default(id,new Tipo.default(Tipo.tipos.LISTA),@1.first_line, @1.first_column,asignacion,l);
	}
	| ID PUNTO ADD PARENTESIS_A condicion_logica PARENTESIS_C PUNTOCOMA 
	{
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1,@1.first_line, @1.first_column);
		var inst  = new llamadaArray.default(new Tipo.default(Tipo.tipos.ADD_LISTA),id,null,$5,@1.first_line, @1.first_column);
		var asignacion = crearAsignacion(id,@1.first_line, @1.first_column,inst);
		$$ = asignacion;
	}
	| ID CORCHETE_A CORCHETE_A condicion_logica CORCHETE_C CORCHETE_C ASIGNACION condicion_logica PUNTOCOMA
	{
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1,@1.first_line, @1.first_column);
		//var entero = new Primitivo.default( new Tipo.default(Tipo.tipos.ENTERO),parseInt($4,10), @1.first_line, @1.first_column);
		var inst  = new llamadaArray.default(new Tipo.default(Tipo.tipos.ADD_LISTA),id,$4,$8,@1.first_line, @1.first_column);
		var asignacion = crearAsignacion(id,@1.first_line, @1.first_column,inst);
		$$ = asignacion;		
	}
	| ID CORCHETE_A condicion_logica CORCHETE_C ASIGNACION condicion_logica PUNTOCOMA
	{
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1,@1.first_line, @1.first_column);
		//var entero = new Primitivo.default( new Tipo.default(Tipo.tipos.ENTERO),parseInt($3,10), @1.first_line, @1.first_column);
		var inst = new llamadaArray.default(new Tipo.default(Tipo.tipos.ADD_VECTOR),id,$3,$6,@1.first_line, @1.first_column);
		var asignacion = crearAsignacion(id,@1.first_line, @1.first_column,inst);
		$$ = asignacion;
	}
;

elementos_coma
	: elementos_coma COMA condicion_logica	
	{
		$1.push($3);
	}
	| condicion_logica 						
	{
		$$ = [$1];
	}
;

acceso_vector
	: ID CORCHETE_A condicion_logica CORCHETE_C 
	{
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1,@1.first_line, @1.first_column);
		//var entero = new Primitivo.default( new Tipo.default(Tipo.tipos.ENTERO),parseInt($3,10), @1.first_line, @1.first_column);
		$$ = new llamadaArray.default(new Tipo.default(Tipo.tipos.LLAMADA_VECTOR),id,$3,null,@1.first_line, @1.first_column);
	}
;

acceso_lista
	: ID CORCHETE_A CORCHETE_A condicion_logica CORCHETE_C CORCHETE_C 
	{
		var id = new Identificador.default(new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1,@1.first_line, @1.first_column);
		//var entero = new Primitivo.default( new Tipo.default(Tipo.tipos.ENTERO),parseInt($4,10), @1.first_line, @1.first_column);
		$$ = new llamadaArray.default(new Tipo.default(Tipo.tipos.LLAMADA_LISTA),id,$4,null,@1.first_line, @1.first_column);
	}
;
/*MANEJO DE LISTAS Y VECTORES-----------------------------------------------*/


/*GRAMATICA METODOS Y FUNCIONES---------------------------------------------*/
declaracion_funcion_metodo
	: asignacion_tipo ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C 
	{
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column);
		$$ = new Funcion.default($1,nId,$4,null,@1.first_line, @1.first_column);
	}
	| asignacion_tipo ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A instrucciones_locales_metodo LLAVE_C 
	{
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column);
		$$ = new Funcion.default($1,nId,$4,$7,@1.first_line, @1.first_column);
	}
	| asignacion_tipo ID PARENTESIS_A PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C 
	{
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column);
		$$ = new Funcion.default($1,nId,null,null,@1.first_line, @1.first_column);
	}
	| asignacion_tipo ID PARENTESIS_A PARENTESIS_C LLAVE_A instrucciones_locales_metodo LLAVE_C 
	{
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column);
		$$ = new Funcion.default($1,nId,null,$6,@1.first_line, @1.first_column);
	}
	| VOID ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C 
	{
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column);
		var nTipo = new Tipo.default(Tipo.tipos.VOID);
		$$ = new Metodo.default(nTipo,nId,$4,null,@1.first_line, @1.first_column);		
	}
	| VOID ID PARENTESIS_A definicion_parametros PARENTESIS_C LLAVE_A instrucciones_locales_metodo LLAVE_C 
	{
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column);
		var nTipo = new Tipo.default(Tipo.tipos.VOID);
		$$ = new Metodo.default(nTipo,nId,$4,$7,@1.first_line, @1.first_column);	
	}
	| VOID ID PARENTESIS_A PARENTESIS_C LLAVE_A /*instrucciones*/ LLAVE_C 
	{
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column);
		var nTipo = new Tipo.default(Tipo.tipos.VOID);
		$$ = new Metodo.default(nTipo,nId,null,null,@1.first_line, @1.first_column);
	}
	| VOID ID PARENTESIS_A PARENTESIS_C LLAVE_A instrucciones_locales_metodo LLAVE_C 
	{
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column);
		var nTipo = new Tipo.default(Tipo.tipos.VOID);
		$$ = new Metodo.default(nTipo,nId,null,$6,@1.first_line, @1.first_column);
	}
;


definicion_parametros
	: definicion_parametros COMA parametro
	{
		$1.push($3);
		$$ = $1;
	}
	| parametro  							
	{
		$$ = [$1]
	}
;

parametro
	: asignacion_tipo ID
	{
		let ntipo = new Tipo.default(Tipo.tipos.PARAMETRO);
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column);
		let nParametro = new Parametro.default(ntipo,@1.first_line, @1.first_column,$1,nId,false,false);
		$$ = nParametro;
		
	}
	| asignacion_tipo CORCHETE_A CORCHETE_C ID
	{
		let ntipo1 = new Tipo.default(Tipo.tipos.PARAMETRO);
		var nId1 = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$4, @1.first_line, @1.first_column);
		let nParametro1 = new Parametro.default(ntipo1,@1.first_line, @1.first_column,$1,nId1,false,true);
		$$ = nParametro1;		
	}
	| LISTA MENOR asignacion_tipo MAYOR ID
	{
		let ntipo2 = new Tipo.default(Tipo.tipos.PARAMETRO);
		var nId2 = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$5, @1.first_line, @1.first_column);
		let nParametro2 = new Parametro.default(ntipo2,@1.first_line, @1.first_column,$3,nId2,true,false);
		$$ = nParametro2;
	}
;
/*GRAMATICA METODOS Y FUNCIONES---------------------------------------------*/


/*LLAMADAS A METODO Y FUNCIONES INCLUYENDO EXEC Y PRINT---------------------*/
llamada_metodo_funcion
	: ID PARENTESIS_A elementos_coma PARENTESIS_C  //LLamadas con parámetros
	{
		let rtipo = new Tipo.default(Tipo.tipos.LLAMADA_FUNCION);
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1, @1.first_line, @1.first_column); 	
		$$ = new llamadaFuncion.default(rtipo,nId,$3,@1.first_line, @1.first_column); 		
	}
	| ID PARENTESIS_A PARENTESIS_C   //Llamadas sin parámetros
	{
		let nntipo = new Tipo.default(Tipo.tipos.LLAMADA_FUNCION);
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$1, @1.first_line, @1.first_column); 	
		$$ = new llamadaFuncion.default(nntipo,nId,null,@1.first_line, @1.first_column); 
	}
	| PRINT PARENTESIS_A condicion_logica PARENTESIS_C  
	{ 
		$$ = new Imprimir.default($3, @1.first_line, @1.first_column); 
	}
	//| PRINT PARENTESIS_A ID PARENTESIS_C PUNTOCOMA {$$ = $1+' '+$2+' '+$3+' '+$4+' '+$5}
	| EXEC ID PARENTESIS_A elementos_coma PARENTESIS_C  
	{
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column); 	
		var llamada = new llamadaFuncion.default(new Tipo.default(Tipo.tipos.LLAMADA_FUNCION),nId,$4,@1.first_line, @1.first_column);
		$$ = new Exec.default(new Tipo.default(Tipo.tipos.EXEC),@1.first_line, @1.first_column,llamada);
	}
	| EXEC ID PARENTESIS_A PARENTESIS_C  
	{
		var nId = new Identificador.default( new Tipo.default(Tipo.tipos.IDENTIFICADOR),$2, @1.first_line, @1.first_column); 	
		var llamada = new llamadaFuncion.default(new Tipo.default(Tipo.tipos.LLAMADA_FUNCION),nId,null,@1.first_line, @1.first_column);
		$$ = new Exec.default(new Tipo.default(Tipo.tipos.EXEC),@1.first_line, @1.first_column,llamada);
	}
	| EXEC PRINT PARENTESIS_A expresion PARENTESIS_C  
	{ 
		var print = new Imprimir.default($4, @1.first_line, @1.first_column); 
		$$ = new Exec.default(new Tipo.default(Tipo.tipos.EXEC),@1.first_line, @1.first_column,print);
	}	
;
/*LLAMADAS A METODO Y FUNCIONES INCLUYENDO EXEC Y PRINT---------------------*/