import { Instruccion } from "../Abstract/Instruccion";
import Excepcion from "../Excepciones/Excepcion";
import Funcion from "../Expresiones/Funcion";
import Metodo from "../Expresiones/Metodo";
import Identificador from "../Expresiones/Identificador";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo, { tipos } from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
const tipo = require('../tablaSimbolos/Tipo');


export default class llamadaFuncion extends Instruccion{
    private id:Identificador;
    private parametros:any;

    constructor(tipo:Tipo, id:Identificador,parametros:any, linea:number, columna:number){
        super(tipo,linea, columna);
        this.id = id;
        this.parametros = parametros;
    }

    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("LLAMADA");
        let nodo2:nodoInstruccion = new nodoInstruccion("LLAMADA_METODO/FUNCION");
        let nodo3:nodoInstruccion = new nodoInstruccion("Llamada_metodo");
        let nodo4:nodoInstruccion = new nodoInstruccion("PARAMETROS");

        if (this.tipo.getTipos() === tipo.tipos.VOID){
            nodo3.agregarHijoNodo(this.id.getNodoInstruccion());
            nodo3.agregarHijoCadena("(");
            if (this.parametros != null){
                let count = 0;
                for (let m of this.parametros){
                    if (count != 0){
                        nodo4.agregarHijoCadena(",");
                    }
                    nodo4.agregarHijoNodo(m.getNodoInstruccion());
                    count++;
                }
                nodo3.agregarHijoNodo(nodo4);
            }
            nodo3.agregarHijoCadena(")"); 
            nodo3.agregarHijoCadena(";");  
            nodo.agregarHijoNodo(nodo3);

        }else{
            nodo2.agregarHijoNodo(this.id.getNodoInstruccion());
            nodo2.agregarHijoCadena("(");
            if (this.parametros != null){
                let count = 0;
                for (let m of this.parametros){
                    if (count != 0){
                        nodo4.agregarHijoCadena(",");
                    }
                    nodo4.agregarHijoNodo(m.getNodoInstruccion());
                    count++;
                }
                nodo2.agregarHijoNodo(nodo4);
            }
            nodo2.agregarHijoCadena(")"); 
            nodo2.agregarHijoCadena(";");
            nodo.agregarHijoNodo(nodo2);
        }

        return nodo;
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada < 1){
            return true;
        }

        //Conseguir el símbolo de la tabla que guarda y hace referencia a la función
        let simbolo = table.existe(this.id.getValor());

        if (simbolo === null){
            var ex:Excepcion = new Excepcion("Semántico", "La variable no existe.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;  
        }

        if ((simbolo.getValor() instanceof Funcion || simbolo.getValor() instanceof Metodo)===false){
            var ex:Excepcion = new Excepcion("Semántico", "La variable no hace referencia a un método.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;              
        }

        if (this.parametros != null){
            simbolo.getValor().setParametrosRecibidos(this.parametros);
        }else{
            simbolo.getValor().setParametrosRecibidos(null);
        }
        if (simbolo.getValor() instanceof Metodo){
            this.getTipo().setTipo(67);
        }else{
            this.getTipo().setTipo(simbolo.getTipo().getTipos());
        }

        let result = simbolo.getValor().interpretar(tree,table);
        return result;    
    }

    public getId(){
        return this.id;
    }
}