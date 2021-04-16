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

export default class ToString extends Instruccion{
    private expresion: any;
    private retorno: any;

    constructor(expresion:any, linea:Number, columna:Number, retorno:Tipo){
        super(new Tipo(tipos.TO_STRING),linea, columna);
        this.expresion = expresion;
        this.retorno = retorno;
    }

    public getTipoRetorno(){
        return this.retorno;
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('TO_STRING');
        nodo.agregarHijoCadena("TO_STRING");
        nodo.agregarHijoCadena("(");
        nodo.agregarHijoNodo(this.expresion.getNodoInstruccion());
        nodo.agregarHijoCadena(")");
        nodo.agregarHijoCadena(";");       
        return nodo;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        let simbolo;
        if(this.expresion.getTipo().getTipos()===tipo.tipos.ENTERO){
            return this.expresion.interpretar()+"";
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.DECIMAL){
            return this.expresion.interpretar()+"";
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.BOOLEANO){
            return this.expresion.interpretar()+"";
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.IDENTIFICADOR){
            simbolo = this.expresion.interpretar(tree,table);
            if (simbolo ==null){
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe.", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;      
            }
            return this.verificarTipo(simbolo,tree); //Si tiene valor cadena la variable
        }else{

            var ex:Excepcion = new Excepcion("Semántico", "El valor no es un número", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;            

        }
    }


    public verificarTipo(variable:any,tree:Arbol){
        if (variable.getTipo().getTipos()===tipo.tipos.ENTERO ){
            return variable.getValor()+"";
        }else if (variable.getTipo().getTipos()===tipo.tipos.DECIMAL){
            return variable.getValor()+"";
        }else if (variable.getTipo().getTipos()===tipo.tipos.BOOLEANO){
            return variable.getValor()+"";
        }else{
            var ex:Excepcion = new Excepcion("Semántico", "El valor no es un número.", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;                      
        }
    }
}