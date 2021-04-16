import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Simbolo from "../tablaSimbolos/Simbolo";

export default class Identificador extends Instruccion{
    private valor: any;
    private table: tablaSimbolos|any;
    private tree: Arbol|any;

    constructor(tipo:Tipo, valor:any, linea:Number, columna:Number,tree?:Arbol, table?:tablaSimbolos){
        super(tipo, linea, columna);
        this.valor = valor;
    }

    public setArbol(tree:Arbol){
        this.tree = tree;
    }

    public setTabla(table:tablaSimbolos){
        this.table = table;
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        let resultado = table.existe(this.valor);
        return resultado; //Retorna el símbolo de la tabla
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion("IDENTIFICADOR");
        nodo.agregarHijoCadena(this.valor);
        return nodo;
    }

    public getValor():string{
        return this.valor;
    }

}