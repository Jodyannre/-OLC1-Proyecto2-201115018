import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";


const tipo = require('../tablaSimbolos/Tipo');

export default class Aritmetica extends Instruccion{
    private valor: any;

    private operandoIzq:any;
    private operandoDer:any;
    private operandoUnario:any;
    private operandoAritmetico:Tipo;
    private preAscii:any;


    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('ARITMÉTICA');
        if (this.operandoUnario){
            nodo.agregarHijoCadena(tipo.tipos[this.operandoUnario.getTipos()]+"");
            nodo.agregarHijoNodo(this.operandoDer.getNodoInstruccion());
        }else{
            nodo.agregarHijoNodo(this.operandoIzq.getNodoInstruccion());
            nodo.agregarHijoCadena(tipo.tipos[this.operandoAritmetico.getTipos()]+"");
            nodo.agregarHijoNodo(this.operandoDer.getNodoInstruccion());
        }
        return nodo;
    }

    public getOperando(){
        return this.operandoDer;
    }

    constructor(operandoDer:any, operandoAritmetico:Tipo, linea:Number, columna:Number,operandoIzq?:any, ) {
        super(operandoAritmetico, linea, columna);
        if (operandoIzq){
            this.operandoIzq = operandoIzq;
        }else{
            this.operandoIzq = null;
        }      
        this.operandoDer = operandoDer;
        this.operandoAritmetico = operandoAritmetico;
        if(operandoIzq){
            this.operandoUnario = null;           
        }else{this.operandoUnario = operandoAritmetico; }

    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        let izquierdo:any = null, derecho:any = null, unario:any = null;
        if (!this.operandoUnario) {
            izquierdo = this.operandoIzq.interpretar(tree,table);

            if (izquierdo instanceof Excepcion) return izquierdo;

            derecho = this.operandoDer.interpretar(tree,table);

            if (derecho instanceof Excepcion) return derecho;
        } else {
            unario = this.operandoDer.interpretar(tree,table);
            if (unario instanceof Excepcion) return unario;
        }
        

        if (this.operandoAritmetico){
            //let operardorEnNumero:number = <number>this.operandoAritmetico.getTipos();
            //+this.operandoAritmetico.getTipos()
            switch(this.operandoAritmetico.getTipos()){
                case 9: // 9 == suma
                ////////////////////////////////////////////////////////////////////////////////////////////////
                    if (this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO) {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        return parseInt(izquierdo, 10) + parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(izquierdo) + parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO)
                    {
                        let numBooleano = izquierdo.toLowerCase()==='true'? 1+parseInt(derecho, 10):parseInt(derecho, 10); //Get el número del booleano
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        return numBooleano;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER)
                    {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(derecho, 10) + ASCII;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(derecho) + parseInt(izquierdo, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(derecho) + parseFloat(izquierdo);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO)
                    {
                        let numBooleano = izquierdo.toLowerCase()==='true'? 1+parseFloat(derecho):parseFloat(derecho); //Get el número del booleano
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return numBooleano;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(derecho) + ASCII;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        let numBooleano = derecho.toLowerCase()==='true'? 1+parseInt(izquierdo, 10):parseInt(izquierdo, 10); //Get el número del booleano
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        return numBooleano;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        let numBooleano = derecho.toLowerCase()==='true'? 1+parseFloat(izquierdo):parseFloat(izquierdo); //Get el número del booleano
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return numBooleano;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(izquierdo, 10) + ASCII;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(izquierdo) + ASCII;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER)
                    {
                        this.tipo = new Tipo(tipo.tipos.CADENA);
                        return "" + izquierdo + derecho;
                    }
                    else if (this.operandoDer.tipo.getTipos() == tipo.tipos.CADENA
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO
                            ||
                            this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CADENA
                            ||
                            this.operandoDer.tipo.getTipos() == tipo.tipos.CADENA
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL
                            ||
                            this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CADENA
                            ||
                            this.operandoDer.tipo.getTipos() == tipo.tipos.CADENA
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO
                            ||
                            this.operandoDer.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CADENA
                            ||
                            this.operandoDer.tipo.getTipos() == tipo.tipos.CADENA
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER
                            ||
                            this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CADENA
                            ||
                            this.operandoDer.tipo.getTipos() == tipo.tipos.CADENA
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CADENA) {
                        this.tipo = new Tipo(tipo.tipos.CADENA);
                        let preCadena = "" + izquierdo + derecho;
                        //preCadena = preCadena.toLowerCase();
                        return preCadena
                    } else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador +", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                ////////////////////////////////////////////////////////////////////////////////////////////////


                    break;
                case 10: //Resta

                    if (this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO) {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        return parseInt(izquierdo, 10) - parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(izquierdo) - parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO)
                    {
                        let numBooleano = izquierdo.toLowerCase()==='true'? 1-parseInt(derecho, 10):parseInt(derecho, 10); //Get el número del booleano
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        return numBooleano;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER)
                    {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII - parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseInt(izquierdo, 10) - parseFloat(derecho);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(izquierdo) - parseFloat(derecho);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO)
                    {
                        let numBooleano = izquierdo.toLowerCase()==='true'? 1-parseFloat(derecho):parseFloat(derecho); //Get el número del booleano
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return numBooleano;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return ASCII - parseFloat(derecho);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        let numBooleano = derecho.toLowerCase()==='true'? parseInt(izquierdo, 10)-1:parseInt(izquierdo, 10); //Get el número del booleano
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        return numBooleano;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        let numBooleano = derecho.toLowerCase()==='true'? parseFloat(izquierdo)-1:parseFloat(izquierdo); //Get el número del booleano
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return numBooleano;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(izquierdo, 10) - ASCII;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(izquierdo) - ASCII;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador -", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }                
                    break;
                ////////////////////////////////////////////////////////////////////////////////////////////////
                case 11: //Multiplicacion

                    if (this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO) {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        return parseInt(izquierdo, 10) * parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(izquierdo) * parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER)
                    {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(derecho, 10) * ASCII;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(derecho) * parseInt(izquierdo, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(derecho) * parseFloat(izquierdo);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(derecho) * ASCII;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseInt(izquierdo, 10) * ASCII;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        return parseFloat(izquierdo) * ASCII;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador *", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                    break;
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////
                case 12: //División
                    var cero:number = 0;
                    if (this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO) {
                        cero = parseInt(derecho, 10);
                        if (cero === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, división por 0.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }                    
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseInt(izquierdo, 10) / parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        cero = parseInt(derecho, 10);
                        if (cero === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, división por 0.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }                    
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(izquierdo) / parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER)
                    {                   
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        cero = parseInt(derecho, 10);
                        if (cero === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, división por 0.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return ASCII/parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        cero = parseFloat(derecho);
                        if (cero === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, división por 0.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseInt(izquierdo, 10) / parseFloat(derecho);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        cero = parseFloat(derecho);
                        if (cero === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, división por 0.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(izquierdo) / parseFloat(derecho);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.CARACTER)
                    {
                        
                        this.preAscii = <string>izquierdo+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii

                        cero = parseFloat(derecho);
                        if (cero === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, división por 0.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }

                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return ASCII / parseFloat(derecho);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        if (ASCII === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, división por 0.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseInt(izquierdo, 10) / ASCII;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.CARACTER
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        
                        this.preAscii = <string>derecho+"";
                        let ASCII:number = this.preAscii.charCodeAt(0); //Get ascii
                        if (ASCII === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, división por 0.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(izquierdo) / ASCII;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador /", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                    break;
                /////////////////////////////////////////////////////////////////////////////////////////////
                case 13: //Modulo
                    var cero:number = 0;
                    if (this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO) {
                        cero = parseInt(derecho, 10);
                        if (cero === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, mod 0 es indefinido.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }   
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseInt(izquierdo, 10) % parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        cero = parseInt(derecho, 10);
                        if (cero === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, mod 0 es indefinido.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }  
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(izquierdo) % parseInt(derecho, 10);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        cero = parseFloat(derecho);
                        if (cero === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, mod 0 es indefinido.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }  
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseInt(izquierdo, 10) % parseFloat(derecho);
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        cero = parseFloat(derecho);
                        if (cero === 0){
                            var ex:Excepcion = new Excepcion("Semantico", "Excepción aritmética, mod 0 es indefinido.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
                            return ex;                        
                        }  
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(izquierdo) % parseFloat(derecho);
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador %", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }

                    break;
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                case 14: //Potencia
                 
                    if (this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO) {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);                   
                        return  Math.pow(parseInt(izquierdo, 10),parseInt(derecho, 10));
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return Math.pow(parseFloat(izquierdo),parseInt(derecho, 10));
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return Math.pow(parseInt(izquierdo, 10),parseFloat(derecho));
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL
                            && this.operandoIzq.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return Math.pow(parseFloat(izquierdo),parseFloat(derecho));
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador ^", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }

                    break;
                //////////////////////////////////////////////////////////////////////////////////////////////////
                
                case 15: //Negacion
                    if (this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);                   
                        return  parseInt(unario, 10) * -1;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        return parseFloat(unario) * -1;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador - unario", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                    break;

                //////////////////////////////////////////////////////////////////////////////////////////////////
                
                case 16: //Incremento
                    if (this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        this.tipo = new Tipo(tipo.tipos.ENTERO); 
                        let result:number = parseInt(unario, 10);
                        result++;                                   
                        return  result;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        let result:number = parseFloat(unario);
                        result++;
                        return result;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador ++", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                    break;

                //////////////////////////////////////////////////////////////////////////////////////////////////
                
                case 17: //Decremento
                    if (this.operandoDer.tipo.getTipos() == tipo.tipos.ENTERO)
                    {
                        this.tipo = new Tipo(tipo.tipos.ENTERO);  
                        let result:number = parseInt(unario, 10);  
                        result--;               
                        return  result;
                    }
                    else if(this.operandoDer.tipo.getTipos() == tipo.tipos.DECIMAL)
                    {
                        this.tipo = new Tipo(tipo.tipos.DECIMAL);
                        let result:number = parseFloat(unario);
                        result--;
                        return result;
                    }
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador --", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                    break;
            }
        }
        return null;
    }
}
