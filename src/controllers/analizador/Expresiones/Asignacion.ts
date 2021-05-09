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
import llamadaArray from "../Instrucciones/llamadaArray";
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
    constructor(id:Identificador,tipo:Tipo, linea : number, columna:number, instruccion:any){
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
        let nodo2:nodoInstruccion = new nodoInstruccion('ASIGNACION_ARRAY');
        let add_vector:boolean = false;
        if (this.instruccion instanceof llamadaArray){
            if (this.instruccion.getTipo().getTipos()=== tipo.tipos.ADD_LISTA
            || this.instruccion.getTipo().getTipos()=== tipo.tipos.ADD_VECTOR){
                add_vector = true;
            }
        }
        if (add_vector){
            nodo2.agregarHijoNodo(this.instruccion.getNodoInstruccion());
            nodo2.agregarHijoCadena(";");
            return nodo2;
        }else{
            nodo.agregarHijoNodo(this.id.getNodoInstruccion());
            nodo.agregarHijoCadena("=");
            nodo.agregarHijoNodo(this.instruccion.getNodoInstruccion());
            nodo.agregarHijoCadena(";");
            return nodo;
        }       
    }

    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada <1){
            return true;
        }
        if (this.pasada===1){
            this.setAmbito(0);
        }
        if (this.pasada > 1 && this.ambito ===0){
            return true;
        }
        let valorFinal:any = null;
        let tipoI = this.instruccion.getTipo().getTipos();
        let esTipo1= tipoI <= 26; //Logico, relacional, aritmetico, primitivo
        let esTipo2 = tipoI === 29//Id
        let esTipo3 = tipoI >=31 && tipoI<=38//Métodos nativos
        let esTipo4 = tipoI === 66//Otros métodos
        let esTipo5 = tipoI === 69; // Ternario
        let esTipo6 = (tipoI === 70 || tipoI === 71); //Es vector o lista
        let esTipo7 = (tipoI === 72 || tipoI === 73); //Es add lista o add vector
        var resultTipo;
        if (esTipo1){
            var simbolo = this.id.interpretar(tree,table);
            let tipoEspecial:any;
            let tipoB:any;
            if (simbolo!=null){            
                if (this.instruccion instanceof Primitivo){
                    //Casos especiales entre decimal-entero y entero-booleano
                    //tipoB = this.instruccion.getTipo().getTipos();
                    tipoEspecial = this.verificarEspeciales(simbolo,this.instruccion,tree,table);
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
                        tipoB = this.instruccion.interpretar(tree,table);
                        tipoB = tipoB.getTipo().getTipos();
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
                        if (this.instruccion instanceof Primitivo){
                            nuevoValor = this.instruccion;
                        }else{
                            nuevoValor = this.instruccion.interpretar(tree,table);
                        }             
                    }
                    nuevoValor.linea = this.linea;
                    nuevoValor.columna = this.columna;
                    simbolo.setValor(nuevoValor);
                    return true;
                }else{
                    //Tipos diferentes
                    var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex;
                }
            }else{
                //La variable no existe
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;
                
            }
        }
        else if (esTipo2){
            
            let simboloAgregar:any = this.id.interpretar(tree,table);
            let tipoEspecial = this.verificarEspeciales(simboloAgregar,this.instruccion,tree,table);
            let simboloValor:any;
            if (typeof tipoEspecial != 'boolean'){
                simboloValor = tipoEspecial;
                simboloAgregar.setValor(simboloValor.getValor());
            }else{
                simboloValor = this.instruccion.interpretar(tree,table);
                if (simboloAgregar.getTipo().getTipos()=== simboloValor.getTipo().getTipos()){
                    simboloAgregar.setValor(simboloValor.getValor());
                    return true;
                }else{
                    var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex;                
                }                
            } 

        }
        else if (esTipo3){
            var simbolo = this.id.interpretar(tree,table);
            let tipoEspecial:any;
            let tipoB:any;
            if (simbolo!=null){
                if (simbolo.getValor()===null && this.pasada!= 1){
                    var ex:Excepcion = new Excepcion("Semántico", "Variable no existe.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
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
                    nuevoValor.linea = this.linea;
                    nuevoValor.columna = this.columna;
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
                //tree.getExcepciones().push(ex);
                return ex;
                
            }

        }else if (esTipo4){
            //Funciones
            var simbolo = this.id.interpretar(tree,table);
            if (simbolo != null){
                this.instruccion.setPasada(2);
                let result = this.instruccion.interpretar(tree,table);
                if (result instanceof Excepcion){
                    return result;
                }
                if (result === true){ //Es un método y es error
                    var ex:Excepcion = new Excepcion("Semántico", "No se puede asignar un valor VOID.", this.linea, this.columna);
                    //tree.addError(ex);
                    return ex;                       
                }
                let tipoEspecial = this.verificarEspeciales(simbolo,result,tree,table);
                if (tipoEspecial != true){
                    tipoEspecial.linea = simbolo.getValor().linea;
                    tipoEspecial.columna = simbolo.getValor().columna;
                    simbolo.setValor(tipoEspecial);
                    return true;
                }
                else if (simbolo.getTipo().getTipos()!= result.getTipo().getTipos()){
                    var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden", this.linea, this.columna);
                    //tree.addError(ex);
                    return ex;                    
                }
                result.linea = simbolo.getValor().linea;
                result.columna = simbolo.getValor().columna;
                simbolo.setValor(result);
                return true;
            }else{
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe", this.linea, this.columna);
                //tree.addError(ex);
                return ex;                
            }

        }else if (esTipo5){
            //Ternario
            var simbolo = this.id.interpretar(tree,table);
            if (simbolo != null){
                this.instruccion.setPasada(1);
                let result = this.instruccion.interpretar(tree,table);
                if (result instanceof Excepcion){
                    return result;
                }
                let tipoEspecial = this.verificarEspeciales(simbolo,result,tree,table);
                if (tipoEspecial != true){
                    tipoEspecial.linea = simbolo.getValor().linea;
                    tipoEspecial.columna = simbolo.getValor().columna;
                    simbolo.setValor(tipoEspecial);
                    return true;
                }

                if (simbolo.getTipo().getTipos()!= result.getTipo().getTipos()){
                    var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden", this.linea, this.columna);
                    //tree.addError(ex);
                    return ex;                    
                }
                result.linea = this.linea;
                result.columna = this.columna;
                simbolo.setValor(result);
                return true;
            }else{
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe", this.linea, this.columna);
                //tree.addError(ex);
                return ex;
            }

        }else if (esTipo6){
            var simbolo = this.id.interpretar(tree,table);
            if (simbolo != null){
                this.instruccion.setPasada(1);
                let result = this.instruccion.interpretar(tree,table);
                if (result instanceof Excepcion){
                    return result;
                }
                if (simbolo.getTipo().getTipos()!= result.getTipo().getTipos()){
                    var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden", this.linea, this.columna);
                    //tree.addError(ex);
                    return ex;                    
                }
                result.linea = this.linea;
                result.columna = this.columna;
                simbolo.setValor(result);
                return true;
            }else{
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe", this.linea, this.columna);
                //tree.addError(ex);
                return ex;
            }
        }else if (esTipo7){
            var simbolo = this.id.interpretar(tree,table);
            if (simbolo != null){
                this.instruccion.setPasada(1);
                let result = this.instruccion.interpretar(tree,table);
                if (result instanceof Excepcion){
                    return result;
                }
                if (result instanceof Excepcion){
                    return result;
                    /*
                    var ex:Excepcion = new Excepcion("Semántico", "Los tipos no coinciden", this.linea, this.columna);
                    //tree.addError(ex);
                    return ex;      
                    */              
                }
                //result.linea = this.linea;
                //result.columna = this.columna;
                //simbolo.setValor(result);
                return true;
            }else{
                var ex:Excepcion = new Excepcion("Semántico", "La variable no existe", this.linea, this.columna);
                //tree.addError(ex);
                return ex;
            }            
        }
        return true;
    }




    public verificarEspeciales(variable:any,valorFinal:any,tree:Arbol, table:tablaSimbolos){
        if (valorFinal.getTipo().getTipos()===tipo.tipos.IDENTIFICADOR){
            valorFinal = valorFinal.interpretar(tree,table); //Se convierte en un símbolo
        }


        if (variable.getTipo().getTipos()=== tipo.tipos.DECIMAL && valorFinal.getTipo().getTipos()===tipo.tipos.ENTERO){
            let numero:Primitivo = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal;
            if (numero.getValor() > 2147483647 || numero.getValor() < -2147483647){
                var ex:Excepcion = new Excepcion("Semántico", "Número fuera de límite", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                //return ex;                        
            }
            let nTipo = new Tipo(tipo.tipos.DECIMAL);
            let nValor;
            if (valorFinal instanceof Primitivo){
                nValor = valorFinal.getValor();
            }else if (valorFinal instanceof Simbolo){
                nValor = valorFinal.getValor().getValor();
            }
            let resultado:Primitivo = new Primitivo(nTipo,nValor,variable.getValor().linea,variable.getValor().columna);
            variable.getValor().setValor(resultado);
            return variable.getValor();
        }
        else
        if (variable.getTipo().getTipos()=== tipo.tipos.ENTERO && valorFinal.getTipo().getTipos()===tipo.tipos.BOOLEANO){
            let booleano:Primitivo = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal;
            if (booleano.getValor() ===true){
                variable.getValor().setValor(1);
                return variable.getValor();
            }else{
                variable.getValor().setValor(0);
                return variable.getValor();
            }
        }
        else
        if (variable.getTipo().getTipos()=== tipo.tipos.ENTERO && valorFinal.getTipo().getTipos()===tipo.tipos.ENTERO){
            let numero:Primitivo = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal;
            if (numero.getValor() > 2147483647 || numero.getValor() < -2147483647){
                var ex:Excepcion = new Excepcion("Semántico", "Número fuera de límite", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                //return ex;                        
            }
            variable.getValor().setValor(valorFinal.getValor());
            return variable.getValor();
            
        }else{
            return true;
        }
    }

    public verificarEspecialesOp(tipoA:any,tipoB:any,variableA:any,variableB:any,tree:Arbol, table:tablaSimbolos){
        let valorFinal:any=variableB;

        if (tipoA=== tipo.tipos.DECIMAL && tipoB===tipo.tipos.ENTERO){
            let numero:any = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal.interpretar(tree,table);
            if (numero.getValor() > 2147483647 || numero.getValor() < -2147483647){
                var ex:Excepcion = new Excepcion("Semántico", "Número fuera de límite", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                //return ex;                        
            }
            variableA.getValor().setValor(numero);
            return variableA.getValor();
        }
        else
        if (tipoA=== tipo.tipos.ENTERO && tipoB===tipo.tipos.BOOLEANO){
            let booleano:Primitivo= valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal.interpretar(tree,table);
            if (booleano.getValor()===true){
                variableA.getValor().setValor(1);
            }else{
                variableA.getValor().setValor(0);
            }        
            return variableA.getValor();
        }
        else
        if (tipoA=== tipo.tipos.ENTERO && tipoB===tipo.tipos.ENTERO){
            let numero:Primitivo = valorFinal instanceof Simbolo? valorFinal.getValor(): valorFinal.interpretar(tree,table);
            if (numero.getValor() > 2147483647 || numero.getValor() < -2147483647){
                var ex:Excepcion = new Excepcion("Semántico", "Número fuera de límite", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                //return ex;                        
            }
            return numero;
        }else{
            return false;
        }        
    }
}
