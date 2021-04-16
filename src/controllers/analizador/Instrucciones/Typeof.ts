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

export default class Typeof extends Instruccion{
    private expresion: any;
    private retorno: any;

    constructor(expresion:any, linea:Number, columna:Number, retorno:Tipo){
        super(new Tipo(tipos.TYPEOF),linea, columna);
        this.expresion = expresion;
        this.retorno = retorno;
    }

    public getTipoRetorno(){
        return this.retorno;
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('TYPEOF');
        nodo.agregarHijoCadena("TYPEOF");
        nodo.agregarHijoCadena("(");
        nodo.agregarHijoNodo(this.expresion.getNodoInstruccion());
        nodo.agregarHijoCadena(")");
        nodo.agregarHijoCadena(";");       
        return nodo;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        let simbolo;
        if(this.expresion.getTipo().getTipos()===tipo.tipos.ENTERO){
            return tipo.tipos[tipo.tipos.ENTERO]+"";
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.DECIMAL){
            return tipo.tipos[tipo.tipos.DECIMAL]+""
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.CADENA){
            return tipo.tipos[tipo.tipos.CADENA]+""
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.CARACTER){
            return tipo.tipos[tipo.tipos.CARACTER]+""
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.BOOLEANO){
            return tipo.tipos[tipo.tipos.BOOLEANO]+""
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
            return tipo.tipos[tipo.tipos.ENTERO]+"";
        }else if (variable.getTipo().getTipos()===tipo.tipos.DECIMAL){
            return tipo.tipos[tipo.tipos.DECIMAL]+"";
        }else if (variable.getTipo().getTipos()===tipo.tipos.CADENA){
            return tipo.tipos[tipo.tipos.CADENA]+"";
        }else if (variable.getTipo().getTipos()===tipo.tipos.CARACTER){
            return tipo.tipos[tipo.tipos.CARACTER]+"";
        }else if (variable.getTipo().getTipos()===tipo.tipos.BOOLEANO){
            return tipo.tipos[tipo.tipos.BOOLEANO]+"";
        }else if (variable.getTipo().getTipos()===tipo.tipos.VECTOR){
            return tipo.tipos[tipo.tipos.VECTOR]+"";
        }else if (variable.getTipo().getTipos()===tipo.tipos.LISTA){
            return tipo.tipos[tipo.tipos.LISTA]+"";
        }else{
            var ex:Excepcion = new Excepcion("Semántico", "El valor no es un número.", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;                      
        }
    }
}