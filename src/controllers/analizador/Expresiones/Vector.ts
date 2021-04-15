import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Identificador from "./Identificador";
const tipo = require('../tablaSimbolos/Tipo');
const Primitivo = require('../Expresiones/Primitivo');


export default class Vector extends Instruccion{
    private valor: any;
    private id:Identificador;
    private size:number;
    private tipoCreacion:Tipo;


    constructor(tipo:Tipo, linea:Number, columna:Number,id:Identificador,size:number,tipoCreacion:Tipo,valor?:any){
        super(tipo, linea, columna);
        this.id = id; 
        this.tipoCreacion = tipoCreacion;
        this.size = size;
        if (valor!=null){
            this.valor = new Array();
            while (valor.length>0){
                this.valor.push(valor.pop());
            }
            //this.valor = valor;   
            this.size = this.valor.length;      
        }else{  
            var array = new Array(size);           
            this.valor = array;
        }
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        return this;
    }

    public setValor(valor:any){
        this.valor = valor;
    }

    public add(valor:any,posicion:number){
        if (posicion < this.size){
            this.valor[posicion]=valor;
        }else{
            //Error no se puede agregar
        }

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
        let nodo:nodoInstruccion = new nodoInstruccion("VECTOR");

        nodo.agregarHijoNodo(this.tipo.getNodoInstruccion());
        nodo.agregarHijoCadena("[");
        nodo.agregarHijoCadena("]");
        nodo.agregarHijoNodo(this.id.getNodoInstruccion());
        nodo.agregarHijoCadena("=");      

        if (this.valor[0]){
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
        }else{
            var numero = new Primitivo.default(tipo.tipos.ENTERO, this.size, 0, 0);
            nodo.agregarHijoCadena("new");
            nodo.agregarHijoNodo(this.tipo.getNodoInstruccion());
            nodo.agregarHijoCadena("[");
            nodo.agregarHijoNodo(numero.getNodoInstruccion());
            nodo.agregarHijoCadena("]");
            nodo.agregarHijoCadena(";");        
        }
        return nodo;
    }

}