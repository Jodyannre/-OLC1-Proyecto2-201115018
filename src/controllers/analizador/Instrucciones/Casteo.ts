import { Instruccion } from "../Abstract/Instruccion";
import Excepcion from "../Excepciones/Excepcion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo, { tipos } from "../tablaSimbolos/Tipo";
import Primitivo from "../Expresiones/Primitivo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
const tipo = require('../tablaSimbolos/Tipo');

export default class Casteo extends Instruccion{
    private expresion: any;

    constructor(tipo:Tipo, expresion:any, linea:number, columna:number){
        //Tipo sería el tipo de casteo, es decir (int), (double), etc
        super(tipo,linea, columna);
        this.expresion = expresion;
    }

    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo2:nodoInstruccion = new nodoInstruccion("CASTEO");
        nodo.agregarHijoNodo(nodo2);
        nodo2.agregarHijoCadena("(");
        nodo2.agregarHijoNodo(this.tipo.getNodoInstruccion());
        nodo2.agregarHijoCadena(")"); 
        nodo2.agregarHijoNodo(this.expresion.getNodoInstruccion());
        nodo2.agregarHijoCadena(";");
        return nodo;
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        //Interpretar la expresión y traer su tipo
        let resultado;

        if (this.expresion instanceof Primitivo){
            resultado = this.expresion;
        }else{
            resultado = this.expresion.interpretar(tree,table); //Get primitivo o error
        }
        
        if (resultado instanceof Excepcion){
            return resultado;
        }

        switch(this.tipo.getTipos()){
            case 1: //Recibe entero
                if (resultado.getTipo().getTipos()===2 //Desde decimal y char a Entero
                || resultado.getTipos().getTipo()===3){
                    let nTipo = new Tipo(tipo.tipos.ENTERO);
                    let nValor;
                    if (resultado.getTipo().getTipos()===3){ //Es char
                        nValor = resultado.getValor().charCodeAt(0);
                    }else{ //Es double
                        nValor = Math.floor(resultado.getValor());
                    }
                    let nPrimitivo:Primitivo = new Primitivo(nTipo,nValor,this.linea,this.columna);
                    return nPrimitivo;
                }else{
                    var ex:Excepcion = new Excepcion("Semántico", "Tipos incompatibles.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex;
                }

            case 2: //Recibe decimal

            if (resultado.getTipo().getTipos()===1 //Desde in y char
            || resultado.getTipos().getTipo()===3){
                let nTipo = new Tipo(tipo.tipos.DECIMAL);
                let nValor;
                if (resultado.getTipo().getTipos()===3){ //Es char
                    nValor = resultado.getValor().charCodeAt(0);
                }else{ //Es int
                    nValor = resultado.getValor();
                }
                let nPrimitivo:Primitivo = new Primitivo(nTipo,nValor,this.linea,this.columna);
                return nPrimitivo;
            }else{
                var ex:Excepcion = new Excepcion("Semántico", "Tipos incompatibles.", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;
            }            

            case 3: //Recibe char
                if (resultado.getTipo().getTipos()===1 //Desde Int
                ){
                    //Rango va desde 33 - 126
                    if (resultado.getValor()>93){ 
                        var ex:Excepcion = new Excepcion("Semántico", "Char fuera de rango.", this.linea, this.columna);
                        //tree.getExcepciones().push(ex);
                        return ex;                        
                    }
                    let nValor = String.fromCharCode(33 + resultado.getValor());
                    let nTipo = new Tipo(tipo.tipos.CARACTER);
                    let nPrimitivo:Primitivo = new Primitivo(nTipo,nValor,this.linea,this.columna);
                    return nPrimitivo;                   
                }else{
                    var ex:Excepcion = new Excepcion("Semántico", "Tipos incompatibles.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex;
                }

            case 5: //Recibe string
                if (resultado.getTipo().getTipos()===1 //Desde entero y decimal
                || resultado.getTipos().getTipo()===2){
                    let nTipo = new Tipo(tipo.tipos.CADENA);
                    let nValor = resultado.interpretar(tree,table) + "";
                    let nPrimitivo:Primitivo = new Primitivo(nTipo,nValor,this.linea,this.columna);
                    return nPrimitivo;
                }else{
                    var ex:Excepcion = new Excepcion("Semántico", "Tipos incompatibles.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex;
                }
        }
    }
}