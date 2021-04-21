import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Relacional from "../Expresiones/Relacional";
import Logica from "../Expresiones/Logica";
import Identificador from "../Expresiones/Identificador";
import Primitivo from "../Expresiones/Primitivo";
import Lista from "../Expresiones/Lista";
import Vector from "../Expresiones/Vector";
import Simbolo from "../tablaSimbolos/Simbolo";
import BREAK from "../Sentencias/BREAK";
import CONTINUE from "../Sentencias/CONTINUE";
import RETURN from "../Sentencias/RETURN";
var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class Funcion extends Instruccion{

    private parametros:any;
    private parametrosRecibidos:any;
    private instrucciones:any;
    private id:any;

    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo2:nodoInstruccion = new nodoInstruccion("Metodo");
        if (this.tipo.getTipos()===60){
            nodo2.agregarHijoCadena("BREAK");
            nodo2.agregarHijoCadena(";");
        }     
        nodo.agregarHijoNodo(nodo2);    
        return nodo;
    }

    public getId(){
        return this.id.getValor();
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


    public interpretar(tree:Arbol, table:tablaSimbolos):any{
        if (this.pasada != 0){
            var ex:Excepcion = new Excepcion("Semantico", "Solo se pueden crear métodos en el ámbito global.", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;    
        }
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
                tree.getExcepciones().push(ex);
                return ex;                   
            }            
        }        

        if (this.parametros.length > 0){
            //Tiene parámetros pero no envian nada
            if (this.parametrosRecibidos === null){
                var ex:Excepcion = new Excepcion("Semantico", "El número de parámetros no concuerda.", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;                   
            }
            //Si el número de parámetros es diferente
            if (this.parametros.length != this.parametrosRecibidos.length){
                var ex:Excepcion = new Excepcion("Semantico", "El número de parámetros no concuerda.", this.linea, this.columna);
                tree.getExcepciones().push(ex);
                return ex;             
            }
            //Verificar el tipo de cada parámetro
            let verificarParams = this.verificarParametros(tree,table);
            //Si el tipo de parámetros es diferente
            if (verificarParams instanceof Excepcion){
                return verificarParams;
            }
            return true;
         
        }

        //Todo bien con los parámetros, entonces crear ámbito
        let nArbol:Arbol = new Arbol(this.instrucciones);
        let nTabla:tablaSimbolos = new tablaSimbolos(3,table);
        table.addSiguiente(nTabla);
        tree.addSiguiente(nArbol);

        //Crear variables con los valores de los parámetros
        this.crearVariablesParametros(tree,table);

        if (this.instrucciones!=null){
            //Si no trae ninguna instrucción error porque no retorna nada
            var ex:Excepcion = new Excepcion("Semantico", "Función sin return.", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;    
        }
        //Buscar si trae return
        let ValidarRetorno = this.retornaValor(nArbol,nTabla);
        if (ValidarRetorno === false){
            var ex:Excepcion = new Excepcion("Semantico", "Función sin return.", this.linea, this.columna);
            tree.getExcepciones().push(ex);
            return ex;              
        }
        
            try{
                for (let m of nArbol.getInstrucciones()){
                    m.setPasada(2);
                    if(m instanceof Excepcion){ // ERRORES SINTACTICOS
                        Errors.push(m);
                        nArbol.addError(m);
                        nArbol.updateConsola((<Excepcion>m).toString());
                    }
                    var result = m.interpretar(nArbol, nTabla);
                    if(result instanceof Excepcion){ // ERRORES SEMÁNTICOS
                        Errors.push(result);
                        nArbol.addError(result);
                        nArbol.updateConsola((<Excepcion>result).toString());
                        return result;
                    } 
                    if (result instanceof BREAK){
                        //A nivel de método o función el break es error
                        var ex:Excepcion = new Excepcion("Semantico", "Error con Break fuera de ciclo o switch.", result.linea, result.columna);
                        nArbol.getExcepciones().push(ex);
                        return ex;
                    }      
                    if (result instanceof CONTINUE){
                        //A nivel de método o función el continue es error
                        var ex:Excepcion = new Excepcion("Semantico", "Error con Continue fuera de Switch o ciclo", result.linea, result.columna);
                        nArbol.getExcepciones().push(ex);
                        return ex;
                    }
                    if (result instanceof RETURN){
                        //Validar el tipo de retorno y si concuerda
                        if (this.tipo.getTipos()!= result.getTipo().getTipos()){
                            var ex:Excepcion = new Excepcion("Semantico", "El tipo del return no es correcto.", this.linea, this.columna);
                            tree.getExcepciones().push(ex);
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
        for (let i:number=0; i< this.parametros.length;i++){
            if (this.parametros[i].getTipo().getTipos()!= this.parametrosRecibidos[i].getTipo().getTipos()){
                var ex:Excepcion = new Excepcion("Semantico", "Los tipos de los parámetros no concuerdan.", this.parametros[i].linea, this.parametros[i].columna);
                tree.getExcepciones().push(ex);
                return ex;                  
            }
        }
        return true;

    }

    public crearVariablesParametros(tree:Arbol, table:tablaSimbolos){
        let nTipo,nValor,nPrimitivo,linea,columna,nSimbolo,nId;

        for (let i:number=0; i< this.parametros.length;i++){
            nTipo = new tipo.default(this.parametros[i].getTipo());
            linea = this.parametros[i].linea;
            columna = this.parametros[i].columna;
            nPrimitivo = this.parametrosRecibidos[i].getValor();
            if (nPrimitivo instanceof Lista || nPrimitivo instanceof Vector){ //Esto sería acceso a lista y vector
                nPrimitivo = nPrimitivo.interpretar(tree,table);
            }
            nValor = nPrimitivo.interpretar(tree,table);
            nPrimitivo = new Primitivo(nTipo,nValor,linea,columna);
            nSimbolo = new Simbolo(nTipo,this.parametros[i].getId(),nPrimitivo);
            table.setVariableNueva(nSimbolo);
        }

    }

    public retornaValor(nArbol:Arbol,nTabla:tablaSimbolos){
        //Aprovechando ver si hay break o continue sueltos que generen un error
        try{
            for (let m of nArbol.getInstrucciones()){

                if (m instanceof BREAK){
                    //A nivel de método o función el break es error
                    var ex:Excepcion = new Excepcion("Semantico", "Error con Break fuera de ciclo o switch.", m.linea, m.columna);
                    nArbol.getExcepciones().push(ex);
                    return ex;
                }      
                if (m instanceof CONTINUE){
                    //A nivel de método o función el continue es error
                    var ex:Excepcion = new Excepcion("Semantico", "Error con Continue fuera de Switch o ciclo", m.linea, m.columna);
                    nArbol.getExcepciones().push(ex);
                    return ex;
                }
                if (m instanceof RETURN){
                    //Validar el tipo de retorno y si concuerda
                    return true;
                }    
            } 
            return false;                                     
        }catch(err){
            console.log(err);
        }
    }

}
