import { Instruccion } from "../Abstract/Instruccion";
import Excepcion from "../Excepciones/Excepcion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo, { tipos } from "../tablaSimbolos/Tipo";
import Simbolo from "../tablaSimbolos/Simbolo";
const tipo = require('../tablaSimbolos/Tipo');
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Vector from "../Expresiones/Vector";
import Lista from "../Expresiones/Lista";
const primitivo = require('../Expresiones/Primitivo');

export default class Truncate extends Instruccion{
    private expresion: any;
    private retorno: any;

    constructor(expresion:any, linea:number, columna:number, retorno:Tipo){
        super(new Tipo(tipos.TRUNCATE),linea, columna);
        this.expresion = expresion;
        this.retorno = retorno;
    }

    public getTipoRetorno(){
        return this.retorno;
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('TRUNCATE');
        nodo.agregarHijoCadena("TRUNCATE");
        nodo.agregarHijoCadena("(");
        nodo.agregarHijoNodo(this.expresion.getNodoInstruccion());
        nodo.agregarHijoCadena(")");
        nodo.agregarHijoCadena(";");       
        return nodo;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        let numero,simbolo;
        if(this.expresion.getTipo().getTipos()===tipo.tipos.ENTERO){
            numero = this.expresion.interpretar(tree,table);
            let nTipo = new tipo.default(tipo.tipos.ENTERO);
            let nValor = numero
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.DECIMAL){
            numero = this.expresion.interpretar(tree,table);
            let nTipo = new tipo.default(tipo.tipos.ENTERO);
            let nValor = Math.floor(numero);
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.IDENTIFICADOR){
            simbolo = this.expresion.interpretar(tree,table);
            if (simbolo ==null){
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe.", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;      
            }
            return this.verificarTipo(simbolo,tree); //Si tiene valor cadena la variable
        }else{

            var ex:Excepcion = new Excepcion("Semántico", "El valor no es un número", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;            

        }
    }


    public verificarTipo(variable:any,tree:Arbol){
        if (variable.getTipo().getTipos()===tipo.tipos.ENTERO ){
            let nTipo = new tipo.default(tipo.tipos.ENTERO);
            let nValor = variable.getValor().getValor();
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if (variable.getTipo().getTipos()===tipo.tipos.DECIMAL){
            let nTipo = new tipo.default(tipo.tipos.ENTERO);
            let nValor = Math.floor(variable.getValor().getValor());
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else{
            var ex:Excepcion = new Excepcion("Semántico", "El valor no es un número.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;                      
        }
    }
}