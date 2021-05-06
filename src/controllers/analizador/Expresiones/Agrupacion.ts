import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Simbolo from "../tablaSimbolos/Simbolo";
import Primitivo from "./Primitivo";
import Identificador from "./Identificador";

const primitivo = require('../Expresiones/Primitivo');
const tipo = require('../tablaSimbolos/Tipo');

export default class Agrupacion extends Instruccion{



    private operacion:any;



    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion('INSTRUCCION');
        let nodo2:nodoInstruccion = new nodoInstruccion('AGRUPACION');
        nodo2.agregarHijoCadena("(");
        nodo2.agregarHijoNodo(this.operacion.getNodoInstruccion());
        nodo2.agregarHijoCadena(")");
        nodo.agregarHijoNodo(nodo2);
        return nodo;
    }



    constructor(tipo:Tipo, linea:number, columna:number,operacion:any) {
        super(tipo, linea, columna);
        if (operacion != null){
            this.operacion = operacion;
        }
    }


    public interpretar(tree:Arbol, table:tablaSimbolos):any{
        let result;
        if (this.operacion instanceof Excepcion){
            return this.operacion; //Error sintáctico
        }

        if (this.operacion instanceof Primitivo){
            result = this.operacion; // Símbolo o null
        }else if (this.operacion instanceof Identificador){
            result = this.operacion.interpretar(tree,table);
            if (result === null){
                var ex:Excepcion = new Excepcion("Error semántico", "La variable no existe.", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;  
            }
            result = result.getValor(); //Get el primitivo del símbolo
        }else{
            result = this.operacion.interpretar(tree,table); //Cualquier operación, obtener valor; un primitivo
            if (result instanceof Excepcion){
                return result;
            }
        }

        //Trae un símbolo con el resultado
        this.tipo.setTipo(result.getTipo().getTipos());
        return result;
    }
}
