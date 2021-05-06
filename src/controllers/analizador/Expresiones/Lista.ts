import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Identificador from "./Identificador";
import Excepcion from "../Excepciones/Excepcion";
const tipo = require('../tablaSimbolos/Tipo');
const Primitivo = require('../Expresiones/Primitivo');


export default class Lista extends Instruccion{
    private valor: any;
    private id:Identificador;
    private size:number;
    private tipoCreacion:Tipo;


    constructor(tipo:Tipo, linea:number, columna:number,id:Identificador,tipoCreacion:Tipo){
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

    public get(pos:number):any{
        let index = this.size > pos;   
        if (!index){
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
        this.valor.splice(pos,1);
        return true;
    }

    public add(valor:any):any{
        this.valor.push(valor);
        this.count();
        return true;
    }
    public asignar(valor:any,posicion:number):any{
        if (posicion < this.size && posicion >= 0){
            this.valor[posicion]=valor;
        }else{
            //Error no se puede agregar
            var ex:Excepcion = new Excepcion("Error semántico", "Posición fuera del límite del vector.", this.linea, this.columna);
            return ex;
        }
        return true;
    }

    public getSize():number{
        return this.size;
    }

    public count(){
        this.size++;
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