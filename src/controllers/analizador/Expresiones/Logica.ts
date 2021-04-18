import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Simbolo from "../tablaSimbolos/Simbolo";
const primitivo = require('../Expresiones/Primitivo');
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
                    } 
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.IDENTIFICADOR)
                    {
                        return this.operarDerId(derecho,tree,table,this.operadorLogico);            
                    }    
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.IDENTIFICADOR
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.BOOLEANO)
                    {
                        return this.operarIzqId(izquierdo,tree,table,this.operadorLogico);            
                    }        
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.IDENTIFICADOR
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.IDENTIFICADOR)
                    {
                        return this.operarAmbosId(izquierdo,derecho,this.operadorLogico,tree,table);            
                    }              
                    else {
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
                    } 
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.IDENTIFICADOR)
                    {
                        return this.operarDerId(derecho,tree,table,this.operadorLogico);            
                    }    
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.IDENTIFICADOR
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.BOOLEANO)
                    {
                        return this.operarIzqId(izquierdo,tree,table,this.operadorLogico);            
                    }        
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.IDENTIFICADOR
                            && this.operandoDer.tipo.getTipos() == tipo.tipos.IDENTIFICADOR)
                    {
                        return this.operarAmbosId(izquierdo,derecho,this.operadorLogico,tree,table);            
                    } 
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador OR", this.linea, this.columna);
                        tree.getExcepciones().push(ex);
                        return ex;
                    }
                case 26:
                    if (this.operandoIzq.tipo.getTipos() == tipo.tipos.BOOLEANO) {
                        var valorUnario:boolean = Boolean(unario);
                        return !valorUnario;
                    }
                    else if(this.operandoIzq.tipo.getTipos() == tipo.tipos.IDENTIFICADOR)
                    {
                        return this.operarIzqId(izquierdo,tree,table,this.operadorLogico);            
                    }     
                    else {
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

    public operarIzqId(izquierdo:any,tree:Arbol,table:tablaSimbolos,operador:any):any{
        let variable:Simbolo|any = izquierdo;
        let op:Logica;
        let resultado;
        if(variable!=null){ //Si existe
            if (variable.getTipo().getTipos()<6){ //Si es del tipo correcto
                let izq = new primitivo.default(variable.getTipo(),variable.getValor(),0,0);
                if (this.operandoDer){       //Operación unaria             
                    op = new Logica(izq,operador,0,0,this.operandoDer);
                }else{
                    op = new Logica(izq,operador,0,0);                                    
                }
                resultado = op.interpretar(tree,table); 
                return resultado;

            }else{
                var ex:Excepcion = new Excepcion("Semantico", "Tipo inválido", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                                  
            }
        }else{
            var ex:Excepcion = new Excepcion("Semantico", "La variable no existe", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;                            
        }  
    }

    public operarDerId(derecha:any,tree:Arbol,table:tablaSimbolos,operador:any):any{
        let variable:Simbolo|any = derecha;
        let op:Logica;
        let resultado;
        if(variable!=null){ //Si existe
            if (variable.getTipo().getTipos()<6){ //Si es del tipo correcto
                let der = new primitivo.default(variable.getTipo(),variable.getValor(),0,0);
                op = new Logica(this.operandoIzq,operador,0,0,der);
                resultado = op.interpretar(tree,table);
                return resultado;
            }else{
                var ex:Excepcion = new Excepcion("Semantico", "Tipo inválido", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                                  
            }
        }else{
            var ex:Excepcion = new Excepcion("Semantico", "La variable no existe", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;                            
        }  
    }

    public operarAmbosId(izquierda:any,derecha:any,operador:any,tree:Arbol,table:tablaSimbolos):any{
        let variableDer:Simbolo|any = derecha;
        let variableIzq:Simbolo|any = izquierda;
        let op:Logica;
        let resultado;
        if(variableDer!=null && variableIzq!=null){ //Si existen
            if (variableIzq.getTipo().getTipos()<6 && variableDer.getTipo().getTipos()<6){ //Si es del tipo correcto
                let der = new primitivo.default(variableDer.getTipo(),variableDer.getValor(),0,0);
                let izq = new primitivo.default(variableIzq.getTipo(),variableIzq.getValor(),0,0);
                op = new Logica(izq,operador,0,0,der);
                resultado = op.interpretar(tree,table);
                return resultado;
            }else{
                var ex:Excepcion = new Excepcion("Semantico", "Tipo inválido", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                                  
            }
        }else{
            var ex:Excepcion = new Excepcion("Semantico", "La variable no existe", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;                            
        }  
    }

}