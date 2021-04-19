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
import Primitivo from "../Expresiones/Primitivo";
const primitivo = require('../Expresiones/Primitivo');

export default class Length extends Instruccion{
    private expresion: any;
    private retorno: any;

    constructor(expresion:any, linea:Number, columna:Number, retorno:Tipo){
        super(new Tipo(tipos.LENGTH),linea, columna);
        this.expresion = expresion;
        this.retorno = retorno;
    }

    public getTipoRetorno(){
        return this.retorno;
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('LENGTH');
        nodo.agregarHijoCadena("LENGTH");
        nodo.agregarHijoCadena("(");
        nodo.agregarHijoNodo(this.expresion.getNodoInstruccion());
        nodo.agregarHijoCadena(")");
        nodo.agregarHijoCadena(";");       
        return nodo;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        let size,simbolo;
        if(this.expresion.getTipo().getTipos()===tipo.tipos.CADENA){
            size = this.expresion.interpretar(tree,table);
            //let nuevoSimbolo = new Primitivo.default( new Tipo.default(Tipo.tipos.ENTERO),parseInt($1,10), @1.first_line, @1.first_column); 
            return size.length;
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.IDENTIFICADOR){
            simbolo = this.expresion.interpretar(tree,table);
            if (simbolo ==null){
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe.", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;      
            }
            return this.verificarTipo(simbolo,tree); //Si tiene valor cadena la variable
        }else{

            var ex:Excepcion = new Excepcion("Semántico", "El valor no es una cadena", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;            

        }
    }


    public verificarTipo(variable:any,tree:Arbol){
        if (variable.getTipo().getTipos()===tipo.tipos.VECTOR ){
            return variable.getValor().getSize();
        }else if (variable.getTipo().getTipos()===tipo.tipos.LISTA){
            return variable.getValor().getSize();
        }else if (variable.getTipo().getTipos()===tipo.tipos.CADENA){
            return variable.getValor().length;
        }else{
            var ex:Excepcion = new Excepcion("Semántico", "El valor no es cadena, ni lista, ni vector.", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;                      
        }
    }
}