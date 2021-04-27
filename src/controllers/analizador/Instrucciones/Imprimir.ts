import { Instruccion } from "../Abstract/Instruccion";
import Excepcion from "../Excepciones/Excepcion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo, { tipos } from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Identificador from "../Expresiones/Identificador";
import Metodo from "../Expresiones/Metodo";
import Exec from '../Instrucciones/Exec';

export default class Imprimir extends Instruccion{
    private expresion: any;

    
    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('LLAMADA');
        let nodo2:nodoInstruccion = new nodoInstruccion('LLAMADA_PRINT');
        nodo2.agregarHijoCadena("PRINT");
        nodo2.agregarHijoCadena("(");
        nodo2.agregarHijoNodo(this.expresion.getNodoInstruccion());
        nodo2.agregarHijoCadena(")");
        nodo2.agregarHijoCadena(";");
        nodo.agregarHijoNodo(nodo2);       
        return nodo;
    }
    
    
    constructor(expresion:any, linea:number, columna:number){
        super(new Tipo(tipos.CADENA),linea, columna);
        this.expresion = expresion;
    }



    public interpretar(tree:Arbol, table:tablaSimbolos){
        //Obtener el valor a imprimir, puede venir un id o una operación 
        if (this.pasada < 2){
            return true;
        }
        let value:any;
        if (this.expresion instanceof Identificador){
            value = this.expresion.interpretar(tree,table); //Get simbolo
            value = value.getValor(); //Get valor primitivo
        }else{
            value = this.expresion;
        }
        if (this.expresion instanceof Metodo){
            var ex:Excepcion = new Excepcion("Semántico", "Más de un exec.", 0, 0);
            tree.getExcepciones().push(ex);
            return ex;
        }

        if (this.expresion instanceof Imprimir){
            var ex:Excepcion = new Excepcion("Semántico", "Más de un exec.", 0, 0);
            tree.getExcepciones().push(ex);
            return ex;
        }

        if (this.expresion instanceof Exec){
            var ex:Excepcion = new Excepcion("Semántico", "Más de un exec.", 0, 0);
            tree.getExcepciones().push(ex);
            return ex;
        }

        value = value.interpretar(tree, table); //Obtener valor final del primitivo

        if(value instanceof Excepcion) return value;

        tree.updateConsola(value+"");
    }
}