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

export default class Logica extends Instruccion{

    private operandoIzq:any;
    private operandoDer:any;
    private operandoUnario:any;
    private operadorLogico:Tipo;
    private operadorDerecho:any;
    private operadorIzq:any;

    constructor(operandoIzq:any, operadorLogico:Tipo, linea:number, columna:number,operandoDer?:any ) {
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
            //izquierdo = this.operandoIzq.interpretar(tree, table);
            if (this.operandoIzq instanceof Primitivo 
                || this.operandoIzq instanceof Identificador){
                    izquierdo = this.operandoIzq;
            }else{
                this.operandoIzq.setPasada(2);
                izquierdo = this.operandoIzq.interpretar(tree,table);
            }

            if (izquierdo instanceof Excepcion) return izquierdo;
            if (izquierdo instanceof Primitivo){
                //Estamos bien
                //this.operadorIzq2 = izquierdo;
                this.operadorIzq = izquierdo;
                izquierdo.setPasada(2);
                izquierdo = izquierdo.interpretar(tree,table);
            }else if (izquierdo instanceof Identificador){
                //this.operadorIzq2 = izquierdo.getValor();
                izquierdo.setPasada(2);
                izquierdo = izquierdo.interpretar(tree,table);
                this.operadorIzq = izquierdo.getValor();
                this.operadorIzq.setPasada(2);
                izquierdo = this.operadorIzq.interpretar(tree,table);
            }
            //derecho = this.operandoDer.interpretar(tree, table);
            if (this.operandoDer instanceof Primitivo 
                || this.operandoDer instanceof Identificador){
                    derecho = this.operandoDer;
            }else{
                this.operandoDer.setPasada(2);
                derecho = this.operandoDer.interpretar(tree,table);
            }
            if (derecho instanceof Excepcion) return derecho; 
            if (derecho instanceof Primitivo){
                //Estamos bien
                //this.operadorDerecho = derecho;
                this.operadorDerecho = derecho;
                derecho.setPasada(2);
                derecho = derecho.interpretar(tree,table);
            }else if (derecho instanceof Identificador){
                //this.operadorDerecho = derecho.getValor();
                derecho.setPasada(2);
                derecho = derecho.interpretar(tree,table);
                this.operadorDerecho = derecho.getValor();
                this.operadorDerecho.setPasada(2);
                derecho = this.operadorDerecho.interpretar(tree,table);
            }
            
        } else {
            //unario = this.operandoIzq.interpretar(tree, table);
            if (this.operandoIzq instanceof Primitivo 
                || this.operandoIzq instanceof Identificador){
                    unario = this.operandoIzq;
            }else{
                this.operandoIzq.setPasada(2);
                unario = this.operandoIzq.interpretar(tree,table);
            }
            if (unario instanceof Excepcion) return unario;
            if (unario instanceof Primitivo){
                //Estamos bien
                //this.operandoIz2 = unario;
                this.operadorIzq = izquierdo;
                unario.setPasada(2);
                unario = unario.interpretar(tree,table);
            }else if (unario instanceof Identificador){
                //this.operadorIzq2 = unario.getValor();
                izquierdo.setPasada(2);
                izquierdo = izquierdo.interpretar(tree,table);
                this.operadorIzq = izquierdo.getValor();
                this.operadorIzq.setPasada(2);
                unario = this.operadorIzq.interpretar(tree,table);
            }
        }

        this.tipo = new tipo.default(tipo.tipos.BOOLEANO);

        if (this.operadorLogico) {
              
            switch (this.operadorLogico.getTipos()) {
                case 24:
                    if (this.operadorIzq.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operadorDerecho.tipo.getTipos() == tipo.tipos.BOOLEANO) {
                        var valorIzq:boolean = Boolean(izquierdo);
                        var valorDer:boolean = Boolean(derecho);
                        let nTipo = new Tipo(tipo.tipos.BOOLEANO);
                        let nValor = valorIzq && valorDer;
                        let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                        return resultado
                    } 
                    else if(this.operadorIzq.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operadorDerecho.tipo.getTipos() == tipo.tipos.IDENTIFICADOR)
                    {
                        return this.operarDerId(derecho,tree,table,this.operadorLogico);            
                    }    
                    else if(this.operadorIzq.tipo.getTipos() == tipo.tipos.IDENTIFICADOR
                            && this.operadorDerecho.tipo.getTipos() == tipo.tipos.BOOLEANO)
                    {
                        return this.operarIzqId(izquierdo,tree,table,this.operadorLogico);            
                    }        
                    else if(this.operadorIzq.tipo.getTipos() == tipo.tipos.IDENTIFICADOR
                            && this.operadorDerecho.tipo.getTipos() == tipo.tipos.IDENTIFICADOR)
                    {
                        return this.operarAmbosId(izquierdo,derecho,this.operadorLogico,tree,table);            
                    }              
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador AND", this.linea, this.columna);
                        //tree.getExcepciones().push(ex);
                        return ex;
                    }
                case 25:
                    if (this.operadorIzq.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operadorDerecho.tipo.getTipos() == tipo.tipos.BOOLEANO) {
                            var valorIzq:boolean = Boolean(izquierdo);
                            var valorDer:boolean = Boolean(derecho);
                            let nTipo = new Tipo(tipo.tipos.BOOLEANO);
                            let nValor = valorIzq || valorDer;
                            let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                            return resultado
                    } 
                    else if(this.operadorIzq.tipo.getTipos() == tipo.tipos.BOOLEANO
                            && this.operadorDerecho.tipo.getTipos() == tipo.tipos.IDENTIFICADOR)
                    {
                        return this.operarDerId(derecho,tree,table,this.operadorLogico);            
                    }    
                    else if(this.operadorIzq.tipo.getTipos() == tipo.tipos.IDENTIFICADOR
                            && this.operadorDerecho.tipo.getTipos() == tipo.tipos.BOOLEANO)
                    {
                        return this.operarIzqId(izquierdo,tree,table,this.operadorLogico);            
                    }        
                    else if(this.operadorIzq.tipo.getTipos() == tipo.tipos.IDENTIFICADOR
                            && this.operadorDerecho.tipo.getTipos() == tipo.tipos.IDENTIFICADOR)
                    {
                        return this.operarAmbosId(izquierdo,derecho,this.operadorLogico,tree,table);            
                    } 
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador OR", this.linea, this.columna);
                        //tree.getExcepciones().push(ex);
                        return ex;
                    }
                case 26:
                    if (this.operadorIzq.tipo.getTipos() == tipo.tipos.BOOLEANO) {
                        var valorUnario:boolean = Boolean(unario);
                        let nTipo = new Tipo(tipo.tipos.BOOLEANO);
                        let nValor = !valorUnario;
                        let resultado:Primitivo = new primitivo.default(nTipo,nValor,this.linea,this.columna);
                        return resultado
                    }
                    else if(this.operadorIzq.tipo.getTipos() == tipo.tipos.IDENTIFICADOR)
                    {
                        return this.operarIzqId(unario,tree,table,this.operadorLogico);            
                    }     
                    else {
                        var ex:Excepcion = new Excepcion("Semantico", "Error de Tipo con el operador NOT", this.linea, this.columna);
                        //tree.getExcepciones().push(ex);
                        return ex;
                    }
                default:
                    break;
            }
        
        }
        return null;
    }

    public operarIzqId(izquierdo:any,tree:Arbol,table:tablaSimbolos,operador:any):any{
        let variable:Simbolo|any = izquierdo.getValor();     
        let op:Logica;
        let resultado;
        if(variable!=null){ //Si existe
            if (variable.getTipo().getTipos()<6){ //Si es del tipo correcto
                //let izq = new primitivo.default(variable.getTipo(),variable.getValor(),0,0);
                if (this.operadorDerecho){       //Operación unaria             
                    op = new Logica(variable,operador,0,0,this.operadorDerecho);
                }else{
                    op = new Logica(variable,operador,0,0);                                    
                }
                resultado = op.interpretar(tree,table); 
                return resultado;

            }else{
                var ex:Excepcion = new Excepcion("Semantico", "Tipo inválido", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;                                  
            }
        }else{
            var ex:Excepcion = new Excepcion("Semantico", "La variable no existe", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;                            
        }  
    }

    public operarDerId(derecha:any,tree:Arbol,table:tablaSimbolos,operador:any):any{
        let variable:Simbolo|any = derecha.getValor();
        let op:Logica;
        let resultado;
        if(variable!=null){ //Si existe
            if (variable.getTipo().getTipos()<6){ //Si es del tipo correcto
                //let der = new primitivo.default(variable.getTipo(),variable.getValor(),0,0);
                op = new Logica(this.operadorIzq,operador,0,0,variable);
                resultado = op.interpretar(tree,table);
                return resultado;
            }else{
                var ex:Excepcion = new Excepcion("Semantico", "Tipo inválido", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;                                  
            }
        }else{
            var ex:Excepcion = new Excepcion("Semantico", "La variable no existe", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;                            
        }  
    }

    public operarAmbosId(izquierda:any,derecha:any,operador:any,tree:Arbol,table:tablaSimbolos):any{
        let variableDer:Simbolo|any = derecha.getValor();
        let variableIzq:Simbolo|any = izquierda.getValor();
        let op:Logica;
        let resultado;
        if(variableDer!=null && variableIzq!=null){ //Si existen
            if (variableIzq.getTipo().getTipos()<6 && variableDer.getTipo().getTipos()<6){ //Si es del tipo correcto
                //let der = new primitivo.default(variableDer.getTipo(),variableDer.getValor(),0,0);
                //let izq = new primitivo.default(variableIzq.getTipo(),variableIzq.getValor(),0,0);
                op = new Logica(variableIzq,operador,0,0,variableDer);
                resultado = op.interpretar(tree,table);
                return resultado;
            }else{
                var ex:Excepcion = new Excepcion("Semantico", "Tipo inválido", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;                                  
            }
        }else{
            var ex:Excepcion = new Excepcion("Semantico", "La variable no existe", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;                            
        }  
    }

}