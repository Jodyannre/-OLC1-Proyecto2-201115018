import { Instruccion } from "../Abstract/Instruccion";
import Excepcion from "../Excepciones/Excepcion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo, { tipos } from "../tablaSimbolos/Tipo";
import Simbolo from "../tablaSimbolos/Simbolo";
const tipo = require('../tablaSimbolos/Tipo');
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
const primitivo = require('../Expresiones/Primitivo');

export default class loLower extends Instruccion{
    private expresion: any;
    private retorno: any;

    constructor(expresion:any, linea:number, columna:number, retorno:Tipo){
        super(new Tipo(tipos.TO_UPPER),linea, columna);
        this.expresion = expresion;
        this.retorno = retorno;
    }

    public getTipoRetorno(){
        return this.retorno;
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('TO_LOWER');
        nodo.agregarHijoCadena("TO_LOWER");
        nodo.agregarHijoCadena("(");
        nodo.agregarHijoNodo(this.expresion.getNodoInstruccion());
        nodo.agregarHijoCadena(")");
        nodo.agregarHijoCadena(";");       
        return nodo;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        let cadena,simbolo;
        if(this.expresion.getTipo().getTipos()===tipo.tipos.CADENA){
            cadena = this.expresion.interpretar(tree,table);
            let nTipo = new tipo.default(tipo.tipos.CADENA);
            let nValor = cadena.toLowerCase();
            let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
            return nPrimitivo;
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.IDENTIFICADOR){
            simbolo = this.expresion.interpretar(tree,table);
            if (simbolo ==null){
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe.", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;      
            }
            if (this.verificarTipo(simbolo)){ //Si tiene valor cadena la variable
                let nTipo = new tipo.default(tipo.tipos.CADENA);
                let nValor = simbolo.getValor().getValor().toLowerCase();
                let nPrimitivo = new primitivo.default( nTipo,nValor,this.linea,this.columna); 
                return nPrimitivo;
            }

        }else{

            var ex:Excepcion = new Excepcion("Semántico", "El valor no es una cadena", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;            

        }
    }


    public verificarTipo(variable:any){
        return variable.getTipo().getTipos()===tipo.tipos.CADENA;
    }
}