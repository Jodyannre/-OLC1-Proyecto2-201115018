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
import llamadaArray from "./llamadaArray";
import llamadaFuncion from "./llamadaFuncion";
const primitivo = require('../Expresiones/Primitivo');

export default class Typeof extends Instruccion{
    private expresion: any;
    private retorno: any;

    constructor(expresion:any, linea:number, columna:number, retorno:Tipo){
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
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.ENTERO]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.DECIMAL){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.DECIMAL]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.CADENA){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.CADENA]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.CARACTER){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.CARACTER]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.BOOLEANO){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.BOOLEANO]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.IDENTIFICADOR){
            simbolo = this.expresion.interpretar(tree,table);
            if (simbolo ==null){
                var ex:Excepcion = new Excepcion("Error semántico", "La variable no existe.", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;      
            }
            simbolo = simbolo.getValor();
            return this.verificarTipo(simbolo,tree); //Si tiene valor cadena la variable
        }else if (this.expresion instanceof llamadaArray
            || this.expresion instanceof llamadaFuncion){
            this.expresion.setPasada(2);
            let result = this.expresion.interpretar(tree,table);  //Se supone una cadena
            if (result instanceof Excepcion){
                return result;
            }
            return this.verificarTipo(result,tree); //Si tiene valor cadena la variable
        }else{
            var ex:Excepcion = new Excepcion("Error semántico", "El valor no es correcto.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;   
        }
    }


    public verificarTipo(variable:any,tree:Arbol){
        if (variable.getTipo().getTipos()===tipo.tipos.ENTERO ){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.ENTERO]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if (variable.getTipo().getTipos()===tipo.tipos.DECIMAL){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.DECIMAL]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if (variable.getTipo().getTipos()===tipo.tipos.CADENA){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.CADENA]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if (variable.getTipo().getTipos()===tipo.tipos.CARACTER){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.CARACTER]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if (variable.getTipo().getTipos()===tipo.tipos.BOOLEANO){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.BOOLEANO]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if (variable.getTipo().getTipos()===tipo.tipos.VECTOR){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.VECTOR]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if (variable.getTipo().getTipos()===tipo.tipos.LISTA){
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = tipo.tipos[tipo.tipos.LISTA]+"";
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else{
            var ex:Excepcion = new Excepcion("Error semántico", "El valor no es correcto.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;                      
        }
    }
}