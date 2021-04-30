import { Instruccion } from "../Abstract/Instruccion";
import Arbol from "../tablaSimbolos/Arbol";
import tablaSimbolos from "../tablaSimbolos/tablaSimbolos";
import Tipo from "../tablaSimbolos/Tipo";
import Excepcion from "../Excepciones/Excepcion";
import { nodoInstruccion } from "../Abstract/nodoInstruccion";
import Relacional from "../Expresiones/Relacional";
import Logica from "../Expresiones/Logica";
import Identificador from "../Expresiones/Identificador";
import BREAK from "./BREAK";
import CONTINUE from "./CONTINUE";
import RETURN from "./RETURN";
var Errors:Array<Excepcion> = new Array<Excepcion>();

const tipo = require('../tablaSimbolos/Tipo');

export default class FOR extends Instruccion{
    private condicion:any;
    private instrucciones:any;
    private inicio:any;
    private incremento:any;



    public getNodoInstruccion(){
        let nodo:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo2:nodoInstruccion = new nodoInstruccion("SENTENCIA_FOR");
        let nodo3:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo4:nodoInstruccion = new nodoInstruccion("INSTRUCCIONES");
        let nodo5:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let nodo6:nodoInstruccion = new nodoInstruccion("CONDICION");
        let temp:any;
        if (this.tipo.getTipos()==62){
            nodo2.agregarHijoCadena("FOR");
            nodo2.agregarHijoCadena("(");
            nodo3.agregarHijoNodo(this.inicio.getNodoInstruccion());
            nodo2.agregarHijoNodo(nodo3);
            nodo2.agregarHijoCadena(";");
            nodo6.agregarHijoNodo(this.condicion.getNodoInstruccion());
            nodo2.agregarHijoNodo(nodo6);
            nodo2.agregarHijoCadena(";");
            nodo5.agregarHijoNodo(this.incremento.getNodoInstruccion());
            nodo2.agregarHijoNodo(nodo5);
            nodo2.agregarHijoCadena(")");
            nodo2.agregarHijoCadena("{");
            if (this.instrucciones!=null){
                for (let instruccion of this.instrucciones){
                    temp = instruccion;
                    nodo4.agregarHijoNodo(temp.getNodoInstruccion());
                }
                nodo2.agregarHijoNodo(nodo4);
            }
            nodo2.agregarHijoCadena("}");
            nodo.agregarHijoNodo(nodo2);
        }         
        return nodo;
    }


    constructor(tipo:Tipo, linea:number, columna:number, inicio:any,condicion:any,incremento:any,instrucciones:any) {
        super(tipo, linea, columna);
        this.condicion = condicion;
        this.inicio = inicio;
        this.incremento = incremento;
        if (instrucciones!=null){
            this.instrucciones = instrucciones;
        }else{
            this.instrucciones = null;
        }
    }


    public interpretar(tree:Arbol, table:tablaSimbolos){
        if (this.pasada<2){
            return true;
        }

        //Verificar cualquier tipo de error en el for
        if (this.inicio ===null 
        ||  this.condicion === null
        ||  this.incremento === null){
            var ex:Excepcion = new Excepcion("Semantico", "Error en la creación del for.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;             
        }
        if (this.inicio instanceof Excepcion){
            return this.inicio;
        } 
        if (this.condicion instanceof Excepcion){
            return this.condicion;
        } 
        if (this.incremento instanceof Excepcion){
            return this.incremento;
        } 

        //Crear nuevo enterno
        let nArbol:Arbol = new Arbol(this.instrucciones);
        let nTabla:tablaSimbolos = new tablaSimbolos(3,table);
        table.addSiguiente(nTabla);
        tree.addSiguiente(nArbol);

        //Inicializar la variable del for
        var inicializacion = this.inicio.interpretar(nArbol,nTabla);

        if (inicializacion instanceof Excepcion){
            return inicializacion;
        }
        //Inicializar condicion
        var estadoCondicion = this.verificarCondicion(nArbol,nTabla); //Retorna primitivo booleano

        if (estadoCondicion instanceof Excepcion){
            return estadoCondicion;
        }
            if (estadoCondicion.getValor()===true){
                //Con instrucciones y condición true

                while (estadoCondicion.getValor() ===true){

                    try{
                        for (let m of nArbol.getInstrucciones()){
                            if(m instanceof Excepcion){ // ERRORES SINTACTICOS
                                Errors.push(m);
                                nArbol.addError(m);
                                nArbol.updateConsola((<Excepcion>m).toString());
                                continue;
                            }
                            if (m===null){
                                break;
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
                                return true;
                            }    
                            if (result instanceof CONTINUE){
                                break;
                            }  
                            if (result instanceof RETURN){
                                return result;
                            }            
                        }                                       
                    }catch(err){
                        console.log(err);
                        return false;
                    }                    
                    //Actualizar condición del for
                    var update = this.incremento.interpretar(nArbol,nTabla);
                    if (update instanceof Excepcion){
                        return update;
                    }
                    //Revisar como sigue la condición
                    estadoCondicion = this.verificarCondicion(nArbol,nTabla);
                }


            }else{
                //Condición fue falsa y terminó el ciclo while
                return true;
            }
    }


    public verificarCondicion(tree:Arbol, table:tablaSimbolos){
        if (this.condicion instanceof Relacional || this.condicion instanceof Logica ){
            var r = this.condicion.interpretar(tree, table); //Retorna primitivo booleano
            return r; //Si es relacion o lógica solo la retorna
        }else if (this.condicion.getTipo().getTipos() === tipo.tipos.BOOLEANO){
            return this.condicion; //Retorna primitivo booleano

        }else if (this.condicion instanceof Identificador){
            var resultado = table.existe(this.condicion.getValor()); //Verificar si existe y retorna un simbolo
            if (resultado !=null){
                if (resultado.getTipo().getTipos()===tipo.tipos.BOOLEANO){
                    return resultado.getValor(); //Retorna primitivo booleano
                }else{ //No es booleana
                    var ex:Excepcion = new Excepcion("Semantico", "El tipo de la variable es incorrecto.", this.linea, this.columna);
                    //tree.getExcepciones().push(ex);
                    return ex; 
                }
            }else{ //No existe
                var ex:Excepcion = new Excepcion("Semantico", "La variable no existe", this.linea, this.columna);
                //tree.getExcepciones().push(ex);
                return ex; 
            }

        }else{ //No es relacional ni logica ni identificador
            var ex:Excepcion = new Excepcion("Semantico", "Condición con resultado no booleano.", this.linea, this.columna);
            //tree.getExcepciones().push(ex);
            return ex;             
        }
    }
}
