import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo,{ tipos } from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Aritmetica from "./Aritmetica";
import Relacional from "./Relacional";
import Logica from "./Logica";
import Primitivo from "./Primitivo";
import Vector from "./Vector";
import Lista from "./Lista";
import Simbolo from "../tablaSimbolos/Simbolo";
import Identificador from "./Identificador";
const tipo = require('../tablaSimbolos/Tipo');
const vector = require('../Expresiones/Vector');
export default class Asignacion extends Instruccion{

    private id:Identificador;
    private instruccion:any;

    /*
    Instrucción puede ser:
    Primitivo
    Id
    Operacion relacional o lógica o aritmética
    Una función
    Una función primitiva
    */
    constructor(id:Identificador,tipo:Tipo, linea : Number, columna:Number, instruccion:any){
        super(tipo,linea,columna);
        this.id = id;
        this.instruccion = instruccion;
    }

    /*
    public getNodoInstruccion():nodoInstruccion{

    }
    */

    public getId(){
        return this.id;
    }

    public getInstruccion(){
        return this.instruccion;
    }

    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion('ASIGNACION');
        nodo.agregarHijoNodo(this.id.getNodoInstruccion());
        nodo.agregarHijoCadena("=");
        nodo.agregarHijoNodo(this.instruccion.getNodoInstruccion());
        nodo.agregarHijoCadena(";");
        return nodo;
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada <1){
            return true;
        }
        let valorFinal:any = null;
        let tipo = this.instruccion.getTipo().getTipos();
        let esTipo1= tipo <= 26; //Logico, relacional, aritmetico, primitivo
        let esTipo2 = tipo === 29//Id
        let esTipo3 = tipo >=31 && tipo<=38//Métodos nativos
        let esTipo4 = tipo === 27//Otros métodos
        if (esTipo1){
            var simbolo = this.id.interpretar(tree,table);
            if (simbolo!=null){
                var resultTipo = this.instruccion.getTipo().getTipos() === simbolo.getTipo().getTipos();
                if (resultTipo){
                    //Si el tipo es correcto
                    var nuevoValor = this.instruccion.interpretar(tree,table);
                    simbolo.setValor(nuevoValor);
                }else{
                    //Tipos diferentes
                    var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;
                }
            }else{
                //La variable no existe
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;
                
            }
        }

        if (esTipo3){
            var simbolo = this.id.interpretar(tree,table);
            if (simbolo!=null){
                var resultTipo = this.instruccion.getTipoRetorno().getTipos() === simbolo.getTipo().getTipos();
                if (resultTipo){
                    //Si el tipo es correcto
                    var nuevoValor = this.instruccion.interpretar(tree,table);
                    simbolo.setValor(nuevoValor);
                }else{
                    //Tipos diferentes
                    var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;
                }
            }else{
                //La variable no existe
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;
                
            }

        }

        


    }

}
