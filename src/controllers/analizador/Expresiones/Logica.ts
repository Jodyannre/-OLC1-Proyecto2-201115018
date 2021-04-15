import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";

const tipo = require('../tablaSimbolos/Tipo');

export default class Logica extends Instruccion{

    private operandoIzq:any;
    private operandoDer:any;
    private operandoUnario:any;
    private operadorLogico:Tipo;

    constructor(operandoIzq:any, operadorLogico:Tipo, linea:Number, columna:Number,operandoDer?:any ) {
        super(operadorLogico, linea, columna);
        if (operandoDer){
            this.operandoDer = operandoDer;
        }else{
            this.operandoDer = undefined;
        }      
        this.operandoIzq = operandoIzq;
        this.operadorLogico = operadorLogico;
        if(operandoDer){
            this.operandoUnario = null;           
        }else{this.operandoUnario = operadorLogico; }

    }

    public getNodoInstruccion():nodoInstruccion{
        let nodo = new nodoInstruccion("Lógico");

        if (this.operandoUnario){
            nodo.agregarHijoCadena(tipo.tipos[this.operandoUnario.getTipos()]+"");
            nodo.agregarHijoNodo(this.operandoIzq.getNodoInstruccion());
        }else{
            nodo.agregarHijoNodo(this.operandoIzq.getNodoInstruccion());
            nodo.agregarHijoCadena(tipo.tipos[this.operadorLogico.getTipos()]+"");
            nodo.agregarHijoNodo(this.operandoDer.getNodoInstruccion());
        }

        return nodo;
    }

    public interpretar(tree:Arbol, table:tablaSimbolos) {
        let izquierdo:any = null, derecho:any = null, unario:any = null;

        if (this.operandoUnario == null) {
            izquierdo = this.operandoIzq.interpretar(tree, table);
            if (izquierdo instanceof Excepcion) return izquierdo;

            derecho = this.operandoDer.interpretar(tree, table);
            if (derecho instanceof Excepcion) return derecho; 
            
        } else {
            unario = this.operandoIzq.interpretar(tree, table);
            if (unario instanceof Excepcion) return unario;
        }

        this.tipo = new tipo.default(tipo.tipos.BOOLEANO);

        if (this.operadorLogico) {
              
            switch (this.operadorLogico.getTipos()) {
                case 24:
                    if (this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.BOOLEANO) {
                        var valorIzq:boolean = Boolean(izquierdo);
                        var valorDer:boolean = Boolean(derecho);
                        return valorIzq && valorDer;
                    } else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador AND", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                case 25:
                    if (this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.BOOLEANO) {
                            var valorIzq:boolean = Boolean(izquierdo);
                            var valorDer:boolean = Boolean(derecho);
                            return valorIzq || valorDer;
                    } else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador OR", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                case 26:
                    if (this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO) {
                        var valorUnario:boolean = Boolean(unario);
                        return !valorUnario;
                    } else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador NOT", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                default:
                    break;
            }
        
        }
        return null;
    }


}