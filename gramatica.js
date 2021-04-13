/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var gramatica = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,4],$V1=[1,5],$V2=[1,6],$V3=[1,7],$V4=[1,8],$V5=[1,9],$V6=[1,10],$V7=[1,11],$V8=[1,12],$V9=[1,16],$Va=[1,17],$Vb=[1,18],$Vc=[1,19],$Vd=[1,20],$Ve=[1,21],$Vf=[1,22],$Vg=[1,23],$Vh=[1,26],$Vi=[5,7,8,11,12,13,14,15,16,18,19,20,21,22,23,24,25,27],$Vj=[1,37],$Vk=[7,8,27],$Vl=[1,40],$Vm=[1,41],$Vn=[1,43],$Vo=[1,44],$Vp=[7,8,11,12,13,14,15,16,27],$Vq=[5,7,8,11,12,13,14,15,16,19,20,21,22,23,24,25,27],$Vr=[5,7,8,11,12,13,14,15,16,22,23,24,25,27],$Vs=[7,8,13,16,27];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"instruccionTemp":4,"EOF":5,"condicion_logica":6,"AND":7,"OR":8,"NOT":9,"relacional":10,"MAYOR_I":11,"MENOR_I":12,"IGUAL":13,"MENOR":14,"MAYOR":15,"DIFERENTE":16,"expresion":17,"POTENCIA":18,"POR":19,"MOD":20,"DIV":21,"MENOS":22,"MAS":23,"INCREMENTO":24,"DECREMENTO":25,"PARENTESIS_A":26,"PARENTESIS_C":27,"ENTERO":28,"DECIMAL":29,"TRUE":30,"FALSE":31,"CADENA":32,"CARACTER":33,"ID":34,"acceso_vector":35,"acceso_lista":36,"metodos_nativos":37,"LENGTH":38,"TRUNCATE":39,"numero":40,"TYPEOF":41,"TO_STRING":42,"TO_CHAR_ARRAY":43,"ROUND":44,"instrucciones_globales":45,"instruccion_global":46,"instrucciones_locales":47,"instruccion_local":48,"instruccion_local_metodo":49,"CONTINUE":50,"PUNTOCOMA":51,"BREAK":52,"instrucciones_locales_metodo":53,"creacion_variable":54,"asignacion_variable":55,"manejo_vector_lista":56,"ciclo_for":57,"ciclo_do_while":58,"ciclo_while":59,"condicion_if":60,"condicion_switch":61,"llamada_metodo_funcion":62,"RETURN":63,"declaracion_funcion_metodo":64,"asignacion_tipo":65,"asignacion_valor_variable":66,"ASIGNACION":67,"TO_UPPER":68,"TO_LOWER":69,"INT":70,"CHAR":71,"DOUBLE":72,"TERNARIO":73,"DOSPUNTOS":74,"asignacion_valor_vector":75,"NEW":76,"CORCHETE_A":77,"CORCHETE_C":78,"LLAVE_A":79,"elementos_coma":80,"LLAVE_C":81,"BOOLEAN":82,"STRING":83,"FOR":84,"ciclo_for_variable":85,"ciclo_for_incremento":86,"DO":87,"WHILE":88,"ciclo_while_condicion":89,"condiciones_logicas":90,"IF":91,"condicion_if_else":92,"ELSE":93,"SWITCH":94,"condiciones_case_switch":95,"condicion_case":96,"CASE":97,"DEFAULT":98,"LISTA":99,"PUNTO":100,"ADD":101,"COMA":102,"definicion_parametros":103,"VOID":104,"PRINT":105,"EXEC":106,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:"AND",8:"OR",9:"NOT",11:"MAYOR_I",12:"MENOR_I",13:"IGUAL",14:"MENOR",15:"MAYOR",16:"DIFERENTE",18:"POTENCIA",19:"POR",20:"MOD",21:"DIV",22:"MENOS",23:"MAS",24:"INCREMENTO",25:"DECREMENTO",26:"PARENTESIS_A",27:"PARENTESIS_C",28:"ENTERO",29:"DECIMAL",30:"TRUE",31:"FALSE",32:"CADENA",33:"CARACTER",34:"ID",38:"LENGTH",39:"TRUNCATE",40:"numero",41:"TYPEOF",42:"TO_STRING",43:"TO_CHAR_ARRAY",44:"ROUND",50:"CONTINUE",51:"PUNTOCOMA",52:"BREAK",63:"RETURN",67:"ASIGNACION",68:"TO_UPPER",69:"TO_LOWER",70:"INT",71:"CHAR",72:"DOUBLE",73:"TERNARIO",74:"DOSPUNTOS",76:"NEW",77:"CORCHETE_A",78:"CORCHETE_C",79:"LLAVE_A",81:"LLAVE_C",82:"BOOLEAN",83:"STRING",84:"FOR",87:"DO",88:"WHILE",90:"condiciones_logicas",91:"IF",93:"ELSE",94:"SWITCH",97:"CASE",98:"DEFAULT",99:"LISTA",100:"PUNTO",101:"ADD",102:"COMA",104:"VOID",105:"PRINT",106:"EXEC"},
productions_: [0,[3,2],[6,3],[6,3],[6,2],[6,1],[10,3],[10,3],[10,3],[10,3],[10,3],[10,3],[10,1],[4,1],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,2],[17,2],[17,2],[17,3],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[37,4],[37,4],[37,4],[37,4],[37,4],[37,4],[37,4],[37,4],[37,4],[37,4],[37,4],[37,4],[37,4],[37,4],[37,4],[45,2],[45,1],[47,2],[47,1],[48,1],[48,2],[48,2],[53,2],[53,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,3],[49,2],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[46,1],[54,2],[55,2],[55,2],[55,2],[66,1],[66,3],[66,6],[66,6],[66,6],[66,6],[66,6],[66,6],[66,6],[66,3],[66,7],[75,7],[75,5],[65,1],[65,1],[65,1],[65,1],[65,1],[57,9],[57,10],[85,1],[85,1],[86,3],[86,2],[86,2],[58,8],[58,9],[89,2],[89,2],[89,2],[59,5],[59,6],[60,6],[60,5],[60,7],[60,6],[92,4],[92,3],[92,2],[61,7],[95,2],[95,1],[96,3],[96,4],[96,2],[96,3],[56,11],[56,9],[56,12],[56,7],[80,3],[80,1],[35,4],[36,6],[64,7],[64,8],[64,6],[64,7],[64,7],[64,8],[64,6],[64,7],[103,4],[103,2],[62,5],[62,4],[62,5],[62,6],[62,5]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return $$[$0-1]
break;
case 2: case 3: case 6: case 7: case 8: case 9: case 10: case 11: case 23: case 66: case 83: case 91: case 104: case 119: case 124: case 127: case 132:
this.$ = $$[$0-2]+' '+$$[$0-1]+' '+$$[$0]
break;
case 4: case 50: case 53: case 54: case 55: case 67: case 78: case 79: case 80: case 81: case 105: case 106: case 109: case 110: case 111: case 120: case 122: case 126: case 145:
this.$ = $$[$0-1]+' '+$$[$0]
break;
case 5: case 12: case 31: case 32: case 133:
this.$ = $$[$0]+' '
break;
case 13: case 49:
this.$ = [$$[$0]]
break;
case 14:
this.$ = new Aritmetica.default($$[$0],new Tipo.default(Tipo.tipos.POTENCIA),_$[$0-2].first_line, _$[$0-2].first_column,$$[$0-2]); 
break;
case 15:
this.$ = new Aritmetica.default($$[$0],new Tipo.default(Tipo.tipos.MULTIPLICACION),_$[$0-2].first_line, _$[$0-2].first_column,$$[$0-2]); 
break;
case 16:
this.$ = new Aritmetica.default($$[$0],new Tipo.default(Tipo.tipos.MODULO),_$[$0-2].first_line, _$[$0-2].first_column,$$[$0-2]); 
break;
case 17:
this.$ = new Aritmetica.default($$[$0],new Tipo.default(Tipo.tipos.DIVISION),_$[$0-2].first_line, _$[$0-2].first_column,$$[$0-2]); 
break;
case 18:
this.$ = new Aritmetica.default($$[$0],new Tipo.default(Tipo.tipos.RESTA),_$[$0-2].first_line, _$[$0-2].first_column,$$[$0-2]); 
break;
case 19:
this.$ = new Aritmetica.default($$[$0],new Tipo.default(Tipo.tipos.SUMA),_$[$0-2].first_line, _$[$0-2].first_column,$$[$0-2]); 
break;
case 20:
this.$ = new Aritmetica.default($$[$0],new Tipo.default(Tipo.tipos.NEGACION),_$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 21:
this.$ = new Aritmetica.default($$[$0-1],new Tipo.default(Tipo.tipos.INCREMENTO),_$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 22:
this.$ = new Aritmetica.default($$[$0-1],new Tipo.default(Tipo.tipos.DECREMENTO),_$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 24:
this.$ = new Primitivo.default( new Tipo.default(Tipo.tipos.ENTERO),$$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 25:
 this.$ = new Primitivo.default( new Tipo.default(Tipo.tipos.DECIMAL),$$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 26: case 27:
 this.$ = new Primitivo.default( new Tipo.default(Tipo.tipos.BOOLEANO),$$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 28:
 this.$ = new Primitivo.default( new Tipo.default(Tipo.tipos.CADENA),$$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 29:
 this.$ = new Primitivo.default( new Tipo.default(Tipo.tipos.CARACTER),$$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 30:
 this.$ = new Variable.default( new Tipo.default(Tipo.tipos.VARIABLE),$$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 33: case 34: case 35: case 36: case 37: case 38: case 39: case 40: case 41: case 42: case 43: case 44: case 45: case 46: case 47: case 118: case 125: case 134: case 144: case 147:
this.$ = $$[$0-3]+' '+$$[$0-2]+' '+$$[$0-1]+' '+$$[$0]
break;
case 48:
$$[$0-1].push($$[$0]); this.$ = $$[$0-1]
break;
case 51: case 52: case 56: case 57: case 58: case 59: case 60: case 61: case 62: case 63: case 64: case 65: case 68: case 69: case 70: case 71: case 72: case 73: case 74: case 75: case 76: case 82: case 95: case 96: case 97: case 98: case 99: case 102: case 103: case 123:
this.$ = $$[$0]+''
break;
case 77:
this.$ = $$[$0]
break;
case 84: case 85: case 86: case 87: case 88: case 89: case 90: case 113: case 114: case 117: case 135: case 138: case 142:
this.$ = $$[$0-5]+' '+$$[$0-4]+' '+$$[$0-3]+' '+$$[$0-2]+' '+$$[$0-1]+' '+$$[$0]
break;
case 92: case 93: case 116: case 121: case 131: case 136: case 139: case 140: case 143:
this.$ = $$[$0-6]+' '+$$[$0-5]+' '+$$[$0-4]+' '+$$[$0-3]+' '+$$[$0-2]+' '+$$[$0-1]+' '+$$[$0]
break;
case 94: case 112: case 115: case 146: case 150:
this.$ = $$[$0-4]+' '+$$[$0-3]+' '+$$[$0-2]+' '+$$[$0-1]+' '+$$[$0]
break;
case 100: case 129:
this.$ = $$[$0-8]+' '+$$[$0-7]+' '+$$[$0-6]+' '+$$[$0-5]+' '+$$[$0-4]+' '+$$[$0-3]+' '+$$[$0-2]+' '+$$[$0-1]+' '+$$[$0]
break;
case 101:
this.$ = $$[$0-9]+' '+$$[$0-8]+' '+$$[$0-7]+' '+$$[$0-6]+' '+$$[$0-5]+' '+$$[$0-4]+' '+$$[$0-3]+' '+$$[$0-2]+' '+$$[$0-1]+' '+$$[$0]
break;
case 107:
this.$ = $$[$0-7]+' '+$$[$0-6]+' '+$$[$0-5]+' '+$$[$0-4]+' '+$$[$0-3]+' '+$$[$0-2]+''+$$[$0-1]
break;
case 108:
this.$ = $$[$0-8]+' '+$$[$0-7]+' '+$$[$0-6]+' '+$$[$0-5]+' '+$$[$0-4]+' '+$$[$0-3]+''+$$[$0-2]+''+$$[$0-1]
break;
case 128:
this.$ = $$[$0-10]+' '+$$[$0-9]+' '+$$[$0-8]+' '+$$[$0-7]+' '+$$[$0-6]+' '+$$[$0-5]+' '+$$[$0-4]+' '+$$[$0-3]+' '+$$[$0-2]+' '+$$[$0-1]+' '+$$[$0]
break;
case 130:
this.$ = $$[$0-11]+' '+$$[$0-10]+' '+$$[$0-9]+' '+$$[$0-8]+' '+$$[$0-7]+' '+$$[$0-6]+' '+$$[$0-5]+' '+$$[$0-4]+' '+$$[$0-3]+' '+$$[$0-2]+' '+$$[$0-1]+' '+$$[$0]
break;
case 137: case 141:
this.$ = $$[$0-7]+' '+$$[$0-6]+' '+$$[$0-5]+' '+$$[$0-4]+' '+$$[$0-3]+' '+$$[$0-2]+' '+$$[$0-1]+' '+$$[$0]
break;
case 148:
 this.$ = new Imprimir.default($$[$0-2], _$[$0-4].first_line, _$[$0-4].first_column); 
break;
case 149:
this.$ = $$[$0-5]+' '+$$[$0-4]+' '+$$[$0-3]+' '+$$[$0-2]+' '+$$[$0-1]+''+$$[$0]
break;
}
},
table: [{3:1,4:2,17:3,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{1:[3]},{5:[1,15]},{5:[2,13],18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,24:$Vf,25:$Vg},{17:24,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{6:25,9:$Vh,10:27,17:28,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},o($Vi,[2,24]),o($Vi,[2,25]),o($Vi,[2,26]),o($Vi,[2,27]),o($Vi,[2,28]),o($Vi,[2,29]),o($Vi,[2,30],{77:[1,29]}),o($Vi,[2,31]),o($Vi,[2,32]),{1:[2,1]},{17:30,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{17:31,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{17:32,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{17:33,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{17:34,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{17:35,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},o($Vi,[2,21]),o($Vi,[2,22]),o($Vi,[2,20]),{7:$Vj,8:[1,38],27:[1,36]},{6:39,9:$Vh,10:27,17:28,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},o($Vk,[2,5],{11:$Vl,12:$Vm,13:[1,42],14:$Vn,15:$Vo,16:[1,45]}),o($Vp,[2,12],{18:$V9,19:$Va,20:$Vb,21:$Vc,22:$Vd,23:$Ve,24:$Vf,25:$Vg}),{28:[1,46],77:[1,47]},o($Vq,[2,14]),o($Vq,[2,15],{18:$V9}),o($Vq,[2,16],{18:$V9}),o($Vq,[2,17],{18:$V9}),o($Vr,[2,18],{18:$V9,19:$Va,20:$Vb,21:$Vc}),o($Vr,[2,19],{18:$V9,19:$Va,20:$Vb,21:$Vc}),o($Vi,[2,23]),{6:48,9:$Vh,10:27,17:28,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{6:49,9:$Vh,10:27,17:28,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},o($Vk,[2,4]),{10:50,17:28,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{10:51,17:28,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{10:52,17:28,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{10:53,17:28,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{10:54,17:28,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{10:55,17:28,22:$V0,26:$V1,28:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7,34:$V8,35:13,36:14},{78:[1,56]},{28:[1,57]},o($Vk,[2,2]),o([8,27],[2,3],{7:$Vj}),o($Vp,[2,6]),o($Vp,[2,7]),o($Vs,[2,8],{11:$Vl,12:$Vm,14:$Vn,15:$Vo}),o($Vp,[2,9]),o($Vp,[2,10]),o($Vs,[2,11],{11:$Vl,12:$Vm,14:$Vn,15:$Vo}),o($Vi,[2,134]),{78:[1,58]},{78:[1,59]},o($Vi,[2,135])],
defaultActions: {15:[2,1]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

    const Excepcion = require('../Excepciones/Excepcion');
    const Tipo = require('../tablaSimbolos/Tipo');
    const Arbol = require('../tablaSimbolos/Arbol');
    const Primitivo = require('../Expresiones/Primitivo');
    const Imprimir = require('../Instrucciones/Imprimir');
	const Aritmetica = require('../Expresiones/Aritmetica');
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:
break;
case 1:/*Ignorar comentario multilínea*/
break;
case 2:/*Retornos de carro y nuevas líneas*/
break;
case 3:/*Saltos de línea*/
break;
case 4:/*Espacios en blanco*/
break;
case 5:return "IF";
break;
case 6:return "ELSE";
break;
case 7:return "FOR";
break;
case 8:return "WHILE";
break;
case 9:return "DO";
break;
case 10:return "SWITCH";
break;
case 11:return "CASE";
break;
case 12:return "DEFAULT";
break;
case 13:return "INT";
break;
case 14:return "DOUBLE";
break;
case 15:return "BOOLEAN";
break;
case 16:return "CHAR";
break;
case 17:return "STRING";
break;
case 18:yy_.yytext = yy_.yytext.substr(1,(yy_.yyleng-2)); return "CADENA";
break;
case 19:yy_.yytext = yy_.yytext.substr(1,(yy_.yyleng-2)); return "CARACTER";
break;
case 20:return "SALTO_LINEA_T";
break;
case 21:return "DOBLE_BARRA_T";
break;
case 22:return "COMILLAS_T";
break;
case 23:return "TABULADOR_T";
break;
case 24:return "COMILLA_T"
break;
case 25:return "COMILLA";
break;
case 26:return "COMILLAS";
break;
case 27:return "VOID";
break;
case 28:return "PRINT";
break;
case 29:return "TO_LOWER";
break;
case 30:return "TO_UPPER";
break;
case 31:return "LENGTH";
break;
case 32:return "ROUND";
break;
case 33:return "TYPEOF";
break;
case 34:return "TO_STRING";
break;
case 35:return "TO_CHAR_ARRAY";
break;
case 36:return "EXEC";
break;
case 37:return "TRUNCATE";
break;
case 38:return "CONTINUE";
break;
case 39:return "BREAK";
break;
case 40:return "RETURN";
break;
case 41:return 11;
break;
case 42:return 12;
break;
case 43:return 13;
break;
case 44:return 16;
break;
case 45:return 15;
break;
case 46:return 14;
break;
case 47:return 18;
break;
case 48:return 24;
break;
case 49:return 23;
break;
case 50:return 25;
break;
case 51:return 22;
break;
case 52:return 19;
break;
case 53:return 21;
break;
case 54:return 20;
break;
case 55:return "ADD";
break;
case 56:return "NEW";
break;
case 57:return "LISTA";
break;
case 58:return 51;
break;
case 59:return 74;
break;
case 60:return 102;
break;
case 61:return 26;
break;
case 62:return 27;
break;
case 63:return 77;
break;
case 64:return 78;
break;
case 65:return 79;
break;
case 66:return 81;
break;
case 67:return "PUNTO";
break;
case 68:return 30;
break;
case 69:return 31;
break;
case 70:return 73;
break;
case 71:return 67;
break;
case 72:return 7;
break;
case 73:return 8;
break;
case 74:return 9;
break;
case 75:return 34;
break;
case 76:return 29;
break;
case 77:return 28;
break;
case 78:return 5;
break;
case 79: console.error('Este es un error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column); 
break;
}
},
rules: [/^(?:\/\/.*)/i,/^(?:[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/])/i,/^(?:[ \r\t]+)/i,/^(?:\n)/i,/^(?:\s+)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:for\b)/i,/^(?:while\b)/i,/^(?:do\b)/i,/^(?:switch\b)/i,/^(?:case\b)/i,/^(?:Default\b)/i,/^(?:int\b)/i,/^(?:double\b)/i,/^(?:boolean\b)/i,/^(?:char\b)/i,/^(?:string\b)/i,/^(?:"[^\n\r"\""|"\\\\""\""]*")/i,/^(?:'[^\n\r]?')/i,/^(?:\\n)/i,/^(?:\\\\)/i,/^(?:\\")/i,/^(?:\\t)/i,/^(?:\\\\')/i,/^(?:\\')/i,/^(?:")/i,/^(?:void\b)/i,/^(?:print\b)/i,/^(?:tolower\b)/i,/^(?:toupper\b)/i,/^(?:length\b)/i,/^(?:round\b)/i,/^(?:typeof\b)/i,/^(?:tostring\b)/i,/^(?:tochararray\b)/i,/^(?:exec\b)/i,/^(?:truncate\b)/i,/^(?:continue\b)/i,/^(?:break\b)/i,/^(?:return\b)/i,/^(?:>=)/i,/^(?:<=)/i,/^(?:==)/i,/^(?:!=)/i,/^(?:>)/i,/^(?:<)/i,/^(?:\^)/i,/^(?:\+\+)/i,/^(?:\+)/i,/^(?:--)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:%)/i,/^(?:add\b)/i,/^(?:new\b)/i,/^(?:list\b)/i,/^(?:;)/i,/^(?::)/i,/^(?:,)/i,/^(?:\()/i,/^(?:\))/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\.)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:\?)/i,/^(?:=)/i,/^(?:&&)/i,/^(?:\|\|)/i,/^(?:!)/i,/^(?:[a-z]([a-z]|[0-9])*)/i,/^(?:[0-9]+(\.[0-9]+)\b)/i,/^(?:[0-9]+\b)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = gramatica;
exports.Parser = gramatica.Parser;
exports.parse = function () { return gramatica.parse.apply(gramatica, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}