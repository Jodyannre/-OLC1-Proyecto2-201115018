import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Identificador from "./Identificador";
const tipo = require('../tablaSimbolos/Tipo');
const Primitivo = require('../Expresiones/Primitivo');


export default class Lista extends Instruccion{
    private valor: any;
    private id:Identificador;
    private size:number;
    private tipoCreacion:Tipo;


    constructor(tipo:Tipo, linea:Number, columna:Number,id:Identificador,tipoCreacion:Tipo){
        super(tipo, linea, columna);
        this.id = id; 
        this.tipoCreacion = tipoCreacion;
        this.size = 0;
        this.valor = new Array();
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        return this;
    }

    public setValor(valor:any){
        this.valor = valor;
    }

    public add(valor:any){
        this.valor.push(valor);
    }

    public getSize():number{
        return this.size;
    }

    public getTipo():Tipo{
        return this.tipo;
    }

    public getValor():Array<any>{
        return this.valor;
    }

    public getId():Identificador{
        return this.id;
    }

    public getTipoCreacion():Tipo{
        return this.tipoCreacion;
    }

    public clear(){
        this.valor = new Array();
    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion("LISTA");

        nodo.agregarHijoCadena("LIST"); 
        nodo.agregarHijoCadena("<");
        nodo.agregarHijoNodo(this.tipo.getNodoInstruccion());
        nodo.agregarHijoCadena(">");
        nodo.agregarHijoNodo(this.id.getNodoInstruccion());
        nodo.agregarHijoCadena("=");      

        if (this.valor[0]){
            /*
            nodo.agregarHijoCadena("{");
            //nodo.agregarHijoCadena("valor");
            let contador = this.getSize()-1;
            for (let elemento of this.valor){
                nodo.agregarHijoNodo(elemento.getNodoInstruccion());
                if (contador > 0){
                    nodo.agregarHijoCadena(",");
                }
                contador--;
            }
            nodo.agregarHijoCadena("}");
            nodo.agregarHijoCadena(";");
            */
        }else{
            nodo.agregarHijoCadena("new");
            nodo.agregarHijoCadena("LIST");
            nodo.agregarHijoCadena("<");
            nodo.agregarHijoNodo(this.tipo.getNodoInstruccion());
            nodo.agregarHijoCadena(">");
            nodo.agregarHijoCadena(";");        
        }
        return nodo;
    }

}