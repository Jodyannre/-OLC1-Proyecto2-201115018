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
const lista = require('../Expresiones/Lista');
const Identificador = require('../Expresiones/Identificador');

export default class ToCharArray extends Instruccion{
    private expresion: any;
    private retorno: any;

    constructor(expresion:any, linea:number, columna:number, retorno:Tipo){
        super(new Tipo(tipos.TO_CHAR_ARRAY),linea, columna);
        this.expresion = expresion;
        this.retorno = retorno;
    }

    public getTipoRetorno(){
        return this.retorno;
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('TO_CHAR_ARRAY');
        nodo.agregarHijoCadena("TO_CHAR_ARRAY");
        nodo.agregarHijoCadena("(");
        nodo.agregarHijoNodo(this.expresion.getNodoInstruccion());
        nodo.agregarHijoCadena(")");
        nodo.agregarHijoCadena(";");       
        return nodo;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        let simbolo,cadena;
        if(this.expresion.getTipo().getTipos()===tipo.tipos.CADENA){
            cadena = this.expresion.interpretar(tree,table);
            return this.getListaDesdeCadena(cadena);
        }else if(this.expresion.getTipo().getTipos()===tipo.tipos.IDENTIFICADOR){
            simbolo = this.expresion.interpretar(tree,table);
            if (simbolo ==null){
                var ex:Excepcion = new Excepcion("Error semántico", "La variable no existe.", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;      
            }
            return this.verificarTipo(simbolo,tree); //Si tiene valor cadena la variable
        }else if (this.expresion instanceof llamadaArray
            || this.expresion instanceof llamadaFuncion){
            this.expresion.setPasada(2);
            let result = this.expresion.interpretar(tree,table);  //Se supone una cadena
            if (result instanceof Excepcion){
                return result;
            }
            return this.getListaDesdeCadena(result);         
        }else{
            var ex:Excepcion = new Excepcion("Error semántico", "El valor no es una cadena", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;   
        }
    }


    public verificarTipo(variable:any,tree:Arbol){
        if (variable.getTipo().getTipos()===tipo.tipos.CADENA ){
            return this.getListaDesdeCadena(variable.getValor());
        }else{
            var ex:Excepcion = new Excepcion("Error semántico", "El valor no es una cadena.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;                      
        }
    }

    public getListaDesdeCadena(cadena:string){
        let nTipo = new tipo.default(tipo.tipos.CARACTER);
        let nId = new Identificador.default(new tipo.default(tipo.tipos.IDENTIFICADOR),"",0,0);
        let nuevaLista = new lista.default(nTipo,this.linea,this.columna,nId,nTipo);
        for (let elemento of cadena){
            nuevaLista.add(elemento);
        }
        return nuevaLista;     
    }
}