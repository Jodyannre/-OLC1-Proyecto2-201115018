import { Instruccion } from "../Abstract/Instruccion";
import Excepcion from "../Excepciones/Excepcion";
import Funcion from "../Expresiones/Funcion";
import Metodo from "../Expresiones/Metodo";
import Identificador from "../Expresiones/Identificador";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo, { tipos } from "../tablaSimbolos/Tipo";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Lista from "../Expresiones/Lista";
import Vector from "../Expresiones/Vector";
import Primitivo from "../Expresiones/Primitivo";
const tipo = require('../tablaSimbolos/Tipo');


export default class llamadaArray extends Instruccion{
    private id:Identificador;
    private posicion:any;
    private dato:any;

    constructor(tipo:Tipo, id:Identificador,posicion:any, dato:any,linea:number, columna:number){
        super(tipo,linea, columna);
        this.id = id;
        this.posicion = posicion;
        this.dato = dato; //Es un primitivo o una instrucción
    }

    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("LLAMADA");
        let nodo2:nodoInstruccion = new nodoInstruccion("ACCESO_LISTA"); 
        let nodo3:nodoInstruccion = new nodoInstruccion("ACCESO_VECTOR");
        let nodo4:nodoInstruccion = new nodoInstruccion("ADD_LISTA");
        let nodo5:nodoInstruccion = new nodoInstruccion("ADD_VECTOR");
        let nodo6:nodoInstruccion = new nodoInstruccion("ASIGNACION");

        if (this.tipo.getTipos()===tipo.tipos.LLAMADA_LISTA){
            nodo2.agregarHijoNodo(this.id.getNodoInstruccion());
            nodo2.agregarHijoCadena("[[");
            nodo2.agregarHijoNodo(this.posicion.getNodoInstruccion());
            nodo2.agregarHijoCadena("]]");
            nodo.agregarHijoNodo(nodo2);
            return nodo;
        }else if (this.tipo.getTipos()===tipo.tipos.LLAMADA_VECTOR){
            nodo3.agregarHijoNodo(this.id.getNodoInstruccion());
            nodo3.agregarHijoCadena("[");
            nodo3.agregarHijoNodo(this.posicion.getNodoInstruccion());
            nodo3.agregarHijoCadena("]");
            nodo.agregarHijoNodo(nodo3);
            return nodo;
        }else if (this.tipo.getTipos()===tipo.tipos.ADD_VECTOR){
            nodo5.agregarHijoNodo(this.id.getNodoInstruccion());
            nodo5.agregarHijoCadena("[");
            nodo5.agregarHijoNodo(this.posicion.getNodoInstruccion());
            nodo5.agregarHijoCadena("]");
            nodo5.agregarHijoCadena("=");
            nodo5.agregarHijoNodo(this.dato.getNodoInstruccion());
            nodo6.agregarHijoNodo(nodo5);
            return nodo6;
        }else if (this.tipo.getTipos()===tipo.tipos.ADD_LISTA && this.posicion ===null){
            nodo4.agregarHijoNodo(this.id.getNodoInstruccion());
            nodo4.agregarHijoCadena(".");
            nodo4.agregarHijoCadena("ADD");
            nodo4.agregarHijoCadena("(");
            nodo4.agregarHijoNodo(this.dato.getNodoInstruccion());
            nodo4.agregarHijoCadena(")");
            nodo6.agregarHijoNodo(nodo4);
            return nodo6;
        }else{
            nodo4.agregarHijoNodo(this.id.getNodoInstruccion());
            nodo4.agregarHijoCadena("[");
            nodo4.agregarHijoCadena("[");
            nodo4.agregarHijoNodo(this.posicion.getNodoInstruccion());
            nodo4.agregarHijoCadena("]");
            nodo4.agregarHijoCadena("]");
            nodo4.agregarHijoCadena("=");
            nodo4.agregarHijoNodo(this.dato.getNodoInstruccion());
            nodo6.agregarHijoNodo(nodo4);
            return nodo6;            
        }

        return false;
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

        if (simbolo.getValor() instanceof Lista && this.tipo.getTipos()===tipo.tipos.LLAMADA_LISTA){
            let lista = <Lista>simbolo.getValor();
            let pos = this.getPosicion(tree,table);
            if (pos instanceof Excepcion){
                return pos;
            }
            let result = lista.get(pos.interpretar(tree,table));
            return result;                
        }else if (simbolo.getValor() instanceof Vector && this.tipo.getTipos()===tipo.tipos.LLAMADA_VECTOR){
            let lista = <Vector>simbolo.getValor();
            let pos = this.getPosicion(tree,table);
            if (pos instanceof Excepcion){
                return pos;
            }
            let result = lista.get(pos.interpretar(tree,table));
            return result;   
        }else if (simbolo.getValor() instanceof Lista && this.tipo.getTipos()===tipo.tipos.ADD_LISTA){
            let lista = <Lista>simbolo.getValor();
            let nValor:any;
            if (this.dato instanceof Primitivo){
                nValor = this.dato; //Get primitivo
            }else if (this.dato instanceof Identificador){
                nValor = this.dato.interpretar(tree,table); //Get símbolo
                if (nValor instanceof Excepcion){
                    return nValor;
                }
                nValor = nValor.getValor(); //Get valor del símbolo
            }else{
                nValor = this.dato;
                nValor.setPasada(2);
                nValor = nValor.interpretar(tree,table); //Siempre devuelve un primitivo o error
            }
            //Verificar error
            if (nValor instanceof Excepcion){
                return nValor;
            }
            //Verificar que la variable no se función, método, vector o lista
            if (nValor instanceof Funcion || nValor instanceof Metodo || nValor instanceof Vector
                || nValor instanceof Lista){
                    var ex:Excepcion = new Excepcion("Semántico", "Ese valor no se puede guardar.", this.linea, this.columna);
                    return ex;
            }
            //Verificar que el tipo del elemento a agregar es correcto
            if (nValor.getTipo().getTipos()!= lista.getTipoCreacion().getTipos()){
                var ex:Excepcion = new Excepcion("Semántico", "Ese valor no es compatible.", this.linea, this.columna);
                return ex;
            }
            let result; 
            if (this.posicion === null){
                result = lista.add(nValor);
            }else{
                let pos = this.getPosicion(tree,table);
                if (pos instanceof Excepcion){
                    return pos;
                }
                result = lista.asignar(nValor,pos.interpretar(tree,table));
            }
            return result;   

        }else if (simbolo.getValor() instanceof Vector && this.tipo.getTipos()===tipo.tipos.ADD_VECTOR){
            let lista = <Vector>simbolo.getValor();
            let nValor:any;
            if (this.dato instanceof Primitivo){
                nValor = this.dato; //Get primitivo
            }else if (this.dato instanceof Identificador){
                nValor = this.dato.interpretar(tree,table); //Get símbolo
                if (nValor instanceof Excepcion){
                    return nValor;
                }
                nValor = nValor.getValor(); //Get valor del símbolo
            }else{
                nValor = this.dato;
                nValor.setPasada(2);
                nValor = nValor.interpretar(tree,table); //Siempre devuelve un primitivo o error
            }
            //Verificar error
            if (nValor instanceof Excepcion){
                return nValor;
            }
            //Verificar que la variable no se función, método, vector o lista
            if (nValor instanceof Funcion || nValor instanceof Metodo || nValor instanceof Vector
                || nValor instanceof Lista){
                    var ex:Excepcion = new Excepcion("Semántico", "Ese valor no se puede guardar.", this.linea, this.columna);
                    return ex;
            }
            //Verificar que el tipo del elemento a agregar es correcto
            if (nValor.getTipo().getTipos()!= lista.getTipoCreacion().getTipos()){
                var ex:Excepcion = new Excepcion("Semántico", "Ese valor no es compatible.", this.linea, this.columna);
                return ex;
            }
            let pos = this.getPosicion(tree,table);
            if (pos instanceof Excepcion){
                return pos;
            }
            let result = lista.add(nValor,pos.interpretar(tree,table));
            return result;
        }else{
            var ex:Excepcion = new Excepcion("Semántico", "La variable no hace referencia a una lista o a un vector.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex; 
        }
    }

    public getPosicion(tree:Arbol,table:tablaSimbolos):any{
        let pos;
        if (this.posicion instanceof Primitivo){
            pos = this.posicion;
        }else if (this.posicion instanceof Identificador){
            pos = this.posicion.interpretar(tree,table);
            if (pos instanceof Excepcion){
                return pos;
            }
            pos = pos?.getValor();
        }else{
            pos = this.posicion.interpretar(tree,table);
        }
        if (pos instanceof Excepcion){
            return pos;
        }
        if (!(pos instanceof Primitivo)){
            var ex:Excepcion = new Excepcion("Semántico", "La variable no hace referencia a un número.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;                 
        }
        if (pos.getTipo().getTipos()!=1){
            var ex:Excepcion = new Excepcion("Semántico", "La variable no hace referencia a un número.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;                 
        }
        return pos;
    }
}