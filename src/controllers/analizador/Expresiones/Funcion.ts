import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Relacional from "../Expresiones/Relacional";
import Logica from "../Expresiones/Logica";
import llamadaArray from "../Instrucciones/llamadaArray";
import llamadaFuncion from "../Instrucciones/llamadaFuncion";
import Identificador from "../Expresiones/Identificador";
import Primitivo from "../Expresiones/Primitivo";
import Lista from "../Expresiones/Lista";
import Vector from "../Expresiones/Vector";
import Simbolo from "../tablaSimbolos/Simbolo";
import BREAK from "../Sentencias/BREAK";
import CONTINUE from "../Sentencias/CONTINUE";
import RETURN from "../Sentencias/RETURN";
import Parametro from "./Parametro";
import FOR from "../Sentencias/FOR";
import SWITCH from "../Sentencias/SWITCH";
var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class Funcion extends Instruccion{

    private parametros:any;
    private parametrosRecibidos:any;
    private instrucciones:any;
    private id:any;

    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("FUNCION");
        let nodo2:nodoInstruccion = new nodoInstruccion("PARAMETROS");
        let nodo3:nodoInstruccion = new nodoInstruccion("INSTRUCCIONES");
        
        nodo.agregarHijoNodo(this.tipo.getNodoInstruccion());
        nodo.agregarHijoNodo(this.id.getNodoInstruccion());

        //nodo.agregarHijoNodo(nodo2);    
        if(this.parametros != null){
            nodo.agregarHijoCadena("(");
            let count = 0;
            for (let m of this.parametros){
                if (count != 0){
                    nodo2.agregarHijoCadena(",");
                }
                nodo2.agregarHijoNodo(m.getNodoInstruccion());
                count++;
            }
            nodo.agregarHijoNodo(nodo2);
            nodo.agregarHijoCadena(")");
        }
        nodo.agregarHijoCadena("{");
        if (this.instrucciones != null){
            for (let m of this.instrucciones){
                nodo3.agregarHijoNodo(m.getNodoInstruccion());
            }
            
            nodo.agregarHijoNodo(nodo3);
            
        }  
        nodo.agregarHijoCadena("}");
        return nodo;
    }

    public getId(){
        return this.id.getValor();
    }

    public getId_Obj(){
        return this.id;
    }

    public getTipoRetorno(){
        return this.tipo.getTipos();
    }

    public setParametrosRecibidos(parametros:any){
        this.parametrosRecibidos = parametros;
    }

    constructor(tipo:Tipo,id:Identificador,parametros:any,instrucciones:any,linea:number, columna:number) {
        super(tipo, linea, columna);
        this.id = id;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
    }

    public setTipo(tipo:any){
        this.tipo.setTipo(tipo);
    }

    public interpretar(tree:Arbol, table:tablaSimbolos):any{
        
        if (this.id instanceof Excepcion){
            return this.id;
        }
        if (this.parametros instanceof Excepcion){
            return this.parametros;
        }
        if (this.instrucciones instanceof Excepcion){
            return this.instrucciones;
        }

        if (this.parametros === null){
            //No tiene parámetros pero le envian
            if (this.parametrosRecibidos != null){
                var ex:Excepcion = new Excepcion("Semantico", "El número de parámetros no concuerda.", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;                   
            }            
        }else{

            if (this.parametros.length > 0){
                //Tiene parámetros pero no envian nada
                if (this.parametrosRecibidos === null){
                    var ex:Excepcion = new Excepcion("Semantico", "El número de parámetros no concuerda.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex;                   
                }
                //Si el número de parámetros es diferente
                if (this.parametros.length != this.parametrosRecibidos.length){
                    var ex:Excepcion = new Excepcion("Semantico", "El número de parámetros no concuerda.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex;             
                }
                //Verificar el tipo de cada parámetro
                let verificarParams = this.verificarParametros(tree,table);
                //Si el tipo de parámetros es diferente
                if (verificarParams instanceof Excepcion){
                    return verificarParams;
                }
                if (!verificarParams){
                    var ex:Excepcion = new Excepcion("Semantico", "Error en los tipos de los parámetros.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex;                     
                }
                //return true;           
            }
        }        

        

        //Todo bien con los parámetros, entonces crear ámbito
        let nArbol:Arbol = new Arbol(this.instrucciones);
        let nTabla:tablaSimbolos = new tablaSimbolos(3,table);
        table.addSiguiente(nTabla);
        tree.addSiguiente(nArbol);
        nTabla.setNombre("Función:"+"\n"+this.id.getValor());

        //Crear variables con los valores de los parámetros
        if (this.parametros != null){
            this.crearVariablesParametros(nArbol,nTabla,tree,table);
        }

        if (this.instrucciones===null){
            //Si no trae ninguna instrucción error porque no retorna nada
            var ex:Excepcion = new Excepcion("Semantico", "Función sin return.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;    
        }
        //Buscar si trae return
        let ValidarRetorno = this.retornaValor(nArbol,nTabla);
        if (ValidarRetorno instanceof Excepcion){
            return ValidarRetorno;
        }
        if (ValidarRetorno === false){
            let buscar = this.buscarReturn();

            if (buscar instanceof RETURN){

            }else{
                var ex:Excepcion = new Excepcion("Semantico", "Función sin return.", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex;    
            } 
        }
            try{
                for (let m of nArbol.getInstrucciones()){
                    
                    if(m instanceof Excepcion){ // ERRORES SINTACTICOS
                        //Errors.push(m);
                        nArbol.addError(m);
                        nArbol.updateConsola((<Excepcion>m).toString());
                        continue;
                    }
                    m.setPasada(2);
                    var result = m.interpretar(nArbol, nTabla);
                    if(result instanceof Excepcion){ // ERRORES SEMÁNTICOS
                        //Errors.push(result);
                        //nArbol.addError(result);
                        //nArbol.updateConsola((<Excepcion>result).toString());
                        return result;
                    } 
                    if (result instanceof BREAK){
                        //A nivel de método o función el break es error
                        var ex:Excepcion = new Excepcion("Semantico", "Error con Break fuera de ciclo o switch.", result.linea, result.columna);
                        //nArbol.getExcepciones().push(ex);
                        return ex;
                    }      
                    if (result instanceof CONTINUE){
                        //A nivel de método o función el continue es error
                        var ex:Excepcion = new Excepcion("Semantico", "Error con Continue fuera de Switch o ciclo", result.linea, result.columna);
                        //nArbol.getExcepciones().push(ex);
                        return ex;
                    }
                    if (result instanceof RETURN){
                        //Validar el tipo de retorno y si concuerda
                        if (result.getValor()===null){
                            var ex:Excepcion = new Excepcion("Semantico", "El tipo del return no es correcto.", this.linea, this.columna);
                            //tree.getExcepciones().push(ex);
                            return ex;                              
                        }
                        if (this.tipo.getTipos()!= result.getTipoRetorno().getTipos()){
                            var ex:Excepcion = new Excepcion("Semantico", "El tipo del return no es correcto.", this.linea, this.columna);
                            //tree.getExcepciones().push(ex);
                            return ex;     
                        }
                        // Si todo esta bien, retorna el valor final en primitivo
                        return result.getValor();
                    }    
                }                                      
            }catch(err){
                console.log(err);
            }
        
        return true;
    }   

    public verificarParametros(tree:Arbol, table:tablaSimbolos){
        let nSimbolo;
        for (let i:number=0; i< this.parametros.length;i++){
            if (this.parametrosRecibidos[i] instanceof Identificador){
                nSimbolo = this.parametrosRecibidos[i].interpretar(tree,table);
                if (nSimbolo instanceof Simbolo){
                    nSimbolo = nSimbolo.getValor();
                }
            }else{
                if ((this.parametrosRecibidos[i]instanceof Primitivo)===true){
                    nSimbolo = this.parametrosRecibidos[i];
                }else if (this.parametrosRecibidos[i]instanceof llamadaFuncion){
                    nSimbolo = this.parametrosRecibidos[i].getId();
                    nSimbolo =table.existe(nSimbolo.getValor()); //Get símbolo
                    if (nSimbolo instanceof Excepcion){
                        return nSimbolo;
                    }
                }
                else{
                    this.parametrosRecibidos[i].setPasada(2);
                    nSimbolo = this.parametrosRecibidos[i].interpretar(tree,table);
                }               
            }
            if ((<Parametro>this.parametros[i]).isLista()){
                if (!(nSimbolo instanceof Lista)){
                    var ex:Excepcion = new Excepcion("Error semántico", "Se espera una lista como parámetro.", this.parametros[i].linea, this.parametros[i].columna);
                    return ex;                      
                }
            }
            else if ((<Parametro>this.parametros[i]).isVector()){
                if (!(nSimbolo instanceof Vector)){
                    var ex:Excepcion = new Excepcion("Error semántico", "Se espera una vector como parámetro.", this.parametros[i].linea, this.parametros[i].columna);
                    return ex;                      
                }
            }
            if (this.parametros[i].getTipo().getTipos()!= nSimbolo.getTipo().getTipos()){
                var ex:Excepcion = new Excepcion("Error semántico", "Los tipos de los parámetros no coinciden.", this.parametros[i].linea, this.parametros[i].columna);
                return ex;                  
            }
        }
        return true;

    }

    public crearVariablesParametros(tree:Arbol, table:tablaSimbolos, treeGlobal:Arbol,tableGlobal:tablaSimbolos){
        let nTipo,nValor,linea,columna,nSimbolo,nId;
        let nPrimitivo:any;

        for (let i:number=0; i< this.parametros.length;i++){
            nTipo = new tipo.default(this.parametros[i].getTipo().getTipos());
            linea = this.parametros[i].linea;
            columna = this.parametros[i].columna;
            nPrimitivo = this.parametrosRecibidos[i];
            if (nPrimitivo instanceof Lista || nPrimitivo instanceof Vector){ //Esto sería acceso a lista y vector
                //nPrimitivo = nPrimitivo.interpretar(tree,table);
                nPrimitivo = nPrimitivo;
            }else if (nPrimitivo instanceof Identificador){
                nPrimitivo = nPrimitivo.interpretar(tree,table);
                nPrimitivo = nPrimitivo.getValor();
            }else if (nPrimitivo instanceof Primitivo){
                //nPrimitivo = nPrimitivo.interpretar(tree,table); //Get resultado en primitivo
            }else if (nPrimitivo instanceof llamadaArray){
                nPrimitivo.setPasada(2);
                nPrimitivo = nPrimitivo.interpretar(tree,table);
            }else if (nPrimitivo instanceof llamadaFuncion){
                nPrimitivo.setPasada(2);
                nPrimitivo = nPrimitivo.interpretar(treeGlobal,tableGlobal);
            }
            nPrimitivo.setPasada(2);
            nValor = nPrimitivo.interpretar(tree,table);
            if (nPrimitivo instanceof Lista || nPrimitivo instanceof Vector){
                nSimbolo = new Simbolo(nTipo,this.parametros[i].getValor().getValor(),nPrimitivo);
                table.setVariableNueva(nSimbolo);
            }else if (nValor instanceof Primitivo){
                nValor = nValor.interpretar(tree,table);
                nPrimitivo = new Primitivo(nTipo,nValor,linea,columna);
                nSimbolo = new Simbolo(nTipo,this.parametros[i].getValor().getValor(),nPrimitivo);
                table.setVariableNueva(nSimbolo);
            }else{
                nPrimitivo = new Primitivo(nTipo,nValor,linea,columna);
                nSimbolo = new Simbolo(nTipo,this.parametros[i].getValor().getValor(),nPrimitivo);
                table.setVariableNueva(nSimbolo);
            }
        }

    }

    public retornaValor(nArbol:Arbol,nTabla:tablaSimbolos){
        //Aprovechando ver si hay break o continue sueltos que generen un error
        try{
            for (let m of nArbol.getInstrucciones()){

                if (m instanceof BREAK){
                    //A nivel de método o función el break es error
                    var ex:Excepcion = new Excepcion("Semantico", "Error con Break fuera de ciclo o switch.", m.linea, m.columna);
                    //nArbol.getExcepciones().push(ex);
                    return ex;
                }      
                if (m instanceof CONTINUE){
                    //A nivel de método o función el continue es error
                    var ex:Excepcion = new Excepcion("Semantico", "Error con Continue fuera de Switch o ciclo", m.linea, m.columna);
                    //nArbol.getExcepciones().push(ex);
                    return ex;
                }
                if (m instanceof RETURN){
                    //Validar el tipo de retorno y si concuerda
                    if (m.getRetorno()===null){
                        //A nivel de método o función el continue es error
                        var ex:Excepcion = new Excepcion("Semantico", "La función no retorna el tipo correcto", m.linea, m.columna);
                        //nArbol.getExcepciones().push(ex);
                        return ex;                        
                    }
                    return true;
                }    
            } 


            return false;                                     
        }catch(err){
            console.log(err);
        }
    }

    public buscarReturn(){
        let resultado:any = false;
        let temp = false;
        for (let m of this.instrucciones){
            if (m instanceof RETURN){
                return m;
            }
            try{
                temp = m.buscarReturn();
                resultado = temp;
                if (resultado instanceof RETURN){
                    return resultado;
                }
            }catch(err){
                console.log("No tiene el método.");
            }
        }
        return false;
    }

}
