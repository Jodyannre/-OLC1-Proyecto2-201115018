import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Identificador from "./Identificador";
import Excepcion from "../Excepciones/Excepcion";
const tipo = require('../tablaSimbolos/Tipo');
const Primitivo = require('../Expresiones/Primitivo');


export default class Vector extends Instruccion{
    private valor: any;
    private id:Identificador;
    private size:number;
    private tipoCreacion:Tipo;


    constructor(tipo:Tipo, linea:number, columna:number,id:Identificador,size:number,tipoCreacion:Tipo,valor?:any){
        super(tipo, linea, columna);
        this.id = id; 
        this.tipoCreacion = tipoCreacion;
        this.size = size;
        if (valor!=null){
            this.valor = new Array<any>();
            while (valor.length>0){
                this.valor.unshift(valor.pop());
            }
            //this.valor = valor;   
            this.size = this.valor.length;      
        }else{  
            this.valor = new Array<any>();           
        }
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        return this;
    }

    public setValor(valor:any){
        this.valor = valor;
    }

    public add(valor:any,posicion:number):any{
        if (posicion < this.size){
            this.valor[posicion]=valor;
        }else{
            //Error no se puede agregar
            var ex:Excepcion = new Excepcion("Error semántico", "Posición fuera del límite del vector.", this.linea, this.columna);
            return ex;
        }
        return true;
    }

    public get(pos:number):any{
        let index = pos < this.size;   
        if (index===false){
            var ex:Excepcion = new Excepcion("Error semántico", "Esa posición no existe en la lista.", this.linea, this.columna);
            return ex;
        }
        return this.valor[pos];
    }

    
    public delete(pos:number):any{
        let index = this.valor.indexOf(pos);   
        if (index ===-1){
            var ex:Excepcion = new Excepcion("Error semántico", "Esa posición no existe en la lista.", this.linea, this.columna);
            return ex;
        }
        this.valor[pos]===null;
        return true;
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
        let nodo2:nodoInstruccion = new nodoInstruccion("ELEMENTOS");
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
                nodo2.agregarHijoNodo(elemento.getNodoInstruccion());
                if (contador > 0){
                    nodo2.agregarHijoCadena(",");
                }
                contador--;
            }
            nodo.agregarHijoNodo(nodo2);
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