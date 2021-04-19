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
        let tipoI = this.instruccion.getTipo().getTipos();
        let esTipo1= tipoI <= 26; //Logico, relacional, aritmetico, primitivo
        let esTipo2 = tipoI === 29//Id
        let esTipo3 = tipoI >=31 && tipoI<=38//Métodos nativos
        let esTipo4 = tipoI === 27//Otros métodos
        var resultTipo;
        if (esTipo1){
            var simbolo = this.id.interpretar(tree,table);
            let tipoEspecial:any;
            let tipoB:any;
            if (simbolo!=null){            
                if (this.instruccion instanceof Primitivo){
                    //Casos especiales entre decimal-entero y entero-booleano
                    tipoB = this.instruccion.getTipo().getTipos();
                    tipoEspecial = this.verificarEspecialesOp(simbolo.getTipo().getTipos(),tipoB,simbolo,this.instruccion,tree,table);
                    if (tipoEspecial instanceof Excepcion){
                        return tipoEspecial;
                    }else
                    if (typeof tipoEspecial != 'boolean'){
                        resultTipo = tipoEspecial;
                    }else{
                        resultTipo = this.instruccion.getTipo().getTipos() === simbolo.getTipo().getTipos();
                    }
                    
                }else{
                    if (this.instruccion instanceof Aritmetica){
                        tipoB = this.instruccion.getTipoResultado(tree,table);
                        tipoEspecial = this.verificarEspecialesOp(simbolo.getTipo().getTipos(),tipoB,simbolo,this.instruccion,tree,table);
                        if (tipoEspecial instanceof Excepcion){
                            return tipoEspecial;
                        }else
                        if (typeof tipoEspecial != 'boolean'){
                            resultTipo = tipoEspecial;
                        }
                        else{
                            resultTipo = tipoB === simbolo.getTipo().getTipos();
                        }     
                    }else if (this.instruccion instanceof Logica || this.instruccion instanceof Relacional){
                        tipoB = tipo.tipos.BOOLEANO;
                        tipoEspecial = this.verificarEspecialesOp(simbolo.getTipo().getTipos(),tipoB,simbolo,this.instruccion,tree,table);
                        if (tipoEspecial instanceof Excepcion){
                            return tipoEspecial;
                        }else
                        if (typeof tipoEspecial != 'boolean'){
                            resultTipo = tipoEspecial;
                        }
                        else{
                        resultTipo = tipo.tipos.BOOLEANO === simbolo.getTipo().getTipos();  
                        }                     
                    }
                }
                if (resultTipo ===true || resultTipo != false){
                    //Si el tipo es correcto
                    let nuevoValor:any;
                    if (typeof resultTipo != 'boolean'){
                        nuevoValor = resultTipo;
                    }else{
                        nuevoValor = this.instruccion.interpretar(tree,table);
                    }
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
        else if (esTipo2){
            
            let simboloAgregar:any = this.id.interpretar(tree,table);
            let tipoEspecial = this.verificarEspeciales(simboloAgregar.getTipo(),this.instruccion,tree,table);
            let simboloValor:any;
            if (typeof tipoEspecial != 'boolean'){
                simboloValor = tipoEspecial;
                simboloAgregar.setValor(simboloValor.getValor());
            }else{
                simboloValor = this.instruccion.interpretar(tree,table);
                if (simboloAgregar.getTipo().getTipos()=== simboloValor.getTipo().getTipos()){
                    simboloAgregar.setValor(simboloValor.getValor());
                }else{
                    var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;                
                }                
            } 

        }
        else if (esTipo3){
            var simbolo = this.id.interpretar(tree,table);
            let tipoEspecial:any;
            let tipoB:any;
            if (simbolo!=null){
                if (simbolo.getValor()===null){
                    var ex:Excepcion = new Excepcion("Semántico", "Variable no existe.", this.linea, this.columna);
                    tree.getExcepciones().push(ex);
                    return ex;                
                }
                tipoB = this.instruccion.getTipoRetorno().getTipos();
                tipoEspecial = this.verificarEspecialesOp(simbolo.getTipo().getTipos(),tipoB,simbolo,this.instruccion,tree,table);
                if (tipoEspecial instanceof Excepcion){
                    return tipoEspecial;
                }else
                if (typeof tipoEspecial != 'boolean'){
                    resultTipo = tipoEspecial;
                }
                else{
                    resultTipo = this.instruccion.getTipoRetorno().getTipos() === simbolo.getTipo().getTipos();
                }                  
              
                if (resultTipo===true || resultTipo != false){
                    //Si el tipo es correcto
                    let nuevoValor:any;
                    if (typeof resultTipo != 'boolean'){
                        nuevoValor = resultTipo;
                    }else{
                        nuevoValor = this.instruccion.interpretar(tree,table);
                    }
                    simbolo.setValor(nuevoValor);
                    return nuevoValor;
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

        }else if (esTipo4){
            //Pendiente hasta que tenga los métodos
        }

    }




    public verificarEspeciales(variable:any,valorFinal:any,tree:Arbol, table:tablaSimbolos){
        if (valorFinal.getTipo().getTipos()===tipo.tipos.IDENTIFICADOR){
            valorFinal = valorFinal.interpretar(tree,table);
        }

        if (variable.getTipos()=== tipo.tipos.DECIMAL && valorFinal.getTipo().getTipos()===tipo.tipos.ENTERO){
            let numero:number = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal.interpretar(tree,table);
            if (numero > 2147483647 || numero < -2147483647){
                var ex:Excepcion = new Excepcion("Semántico", "Número fuera de límite", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                        
            }
            return parseFloat(numero+".0");
        }
        else
        if (variable.getTipos()=== tipo.tipos.ENTERO && valorFinal.getTipo().getTipos()===tipo.tipos.BOOLEANO){
            let booleano:any = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal.interpretar(tree,table);
            if (booleano ===true){
                return 1;
            }else{
                return 0;
            }
        }
        else
        if (variable.getTipos()=== tipo.tipos.ENTERO && valorFinal.getTipo().getTipos()===tipo.tipos.ENTERO){
            let numero:number = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal.interpretar(tree,table);
            if (numero > 2147483647 || numero < -2147483647){
                var ex:Excepcion = new Excepcion("Semántico", "Número fuera de límite", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                        
            }else{
                return numero;
            }
        }else{
            return true;
        }
    }

    public verificarEspecialesOp(tipoA:any,tipoB:any,variableA:any,variableB:any,tree:Arbol, table:tablaSimbolos){
        let valorFinal:any=variableB;

        if (tipoA=== tipo.tipos.DECIMAL && tipoB===tipo.tipos.ENTERO){
            let numero:number = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal.interpretar(tree,table);
            if (numero > 2147483647 || numero < -2147483647){
                var ex:Excepcion = new Excepcion("Semántico", "Número fuera de límite", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                        
            }
            return parseFloat(numero+".0");
        }
        else
        if (tipoA=== tipo.tipos.ENTERO && tipoB===tipo.tipos.BOOLEANO){
            let booleano:any = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal.interpretar(tree,table);
            if (booleano ===true){
                return 1;
            }else{
                return 0;
            }
        }
        else
        if (tipoA=== tipo.tipos.ENTERO && tipoB===tipo.tipos.ENTERO){
            let numero:number = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal.interpretar(tree,table);
            if (numero > 2147483647 || numero < -2147483647){
                var ex:Excepcion = new Excepcion("Semántico", "Número fuera de límite", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                        
            }else{
                return numero;
            }
        }else{
            return true;
        }        
    }
}
