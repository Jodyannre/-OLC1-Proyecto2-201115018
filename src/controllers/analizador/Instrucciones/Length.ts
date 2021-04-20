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

    constructor(expresion:any, linea:number, columna:number, retorno:Tipo){
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
            let nTipo = new tipo.default(tipo.tipos.ENTERO);
            let nValor = size.length;
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.IDENTIFICADOR){
            simbolo = this.expresion.interpretar(tree,table);
            if (simbolo ===null){
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
        //Variable viene como Simbolo
        if (variable.getTipo().getTipos()===tipo.tipos.VECTOR ){
            let nTipo = new tipo.default(tipo.tipos.ENTERO);
            let nValor = variable.getValor().getSize();
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if (variable.getTipo().getTipos()===tipo.tipos.LISTA){
            let nTipo = new tipo.default(tipo.tipos.ENTERO);
            let nValor = variable.getValor().getSize();
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if (variable.getTipo().getTipos()===tipo.tipos.CADENA){
            let nTipo = new tipo.default(tipo.tipos.ENTERO);
            let nValor = variable.getValor().getValor().length;
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else{
            var ex:Excepcion = new Excepcion("Semántico", "El valor no es cadena, ni lista, ni vector.", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;                      
        }
    }
}