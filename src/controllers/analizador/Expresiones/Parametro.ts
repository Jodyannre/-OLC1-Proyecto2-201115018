import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Relacional from "../Expresiones/Relacional";
import Logica from "../Expresiones/Logica";
import Identificador from "../Expresiones/Identificador";
import Primitivo from "../Expresiones/Primitivo";
var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class Parametro extends Instruccion{
    private tipoValor:any;
    private valor:any;
    private vector:boolean;
    private lista:boolean;


    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("PARAMETRO");
        nodo.agregarHijoNodo(this.tipoValor.getNodoInstruccion());
        nodo.agregarHijoNodo(this.valor.getNodoInstruccion());
        return nodo;
    }


    constructor(tipo:Tipo, linea:number, columna:number,tipoValor:Tipo,valor:any,lista:boolean,vector:boolean) {
        super(tipo, linea, columna);
        this.tipoValor = tipoValor;
        this.valor = valor;
        this.lista = lista;
        this.vector = vector;
    }

    public isLista(){
        return this.lista;
    }

    public isVector(){
        return this.vector;
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        return this;
    }   

    public getTipo(){
        return this.tipoValor;
    }

    public compararTipo(tipo:number){
        return this.tipoValor.getTipos()===tipo;
    }

    public getValor(){
        return this.valor; //En teoría retorna un primitivo o un id
    }

    public getIdValor(){
        return this.valor.getValor();
    }

}
