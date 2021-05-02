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

export default class ELSE extends Instruccion{
    private instrucciones:any;



    public getNodoInstruccion():nodoInstruccion{
        let nodo:nodoInstruccion = new nodoInstruccion("SENTENCIA_ELSE");
        let nodo2:nodoInstruccion = new nodoInstruccion("INSTRUCCION");
        let temp;
        nodo.agregarHijoCadena("ELSE");
        nodo.agregarHijoCadena("{");
        if (this.instrucciones!=null){
            for (let instruccion of this.instrucciones){
                temp = instruccion;
                nodo2.agregarHijoNodo(temp.getNodoInstruccion());
            }
            nodo.agregarHijoNodo(nodo2);
        }
        nodo.agregarHijoCadena("}");
        return nodo;
    }


    constructor(tipo:Tipo, linea:number, columna:number, instrucciones?:any) {
        super(tipo, linea, columna);
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
        //Con instrucciones, pero sin if else o else
        let nArbol:Arbol = new Arbol(this.instrucciones);
        let nTabla:tablaSimbolos = new tablaSimbolos(3,table);
        table.addSiguiente(nTabla);
        tree.addSiguiente(nArbol);
        nTabla.setNombre(table.getNombre()+"\n"+"Else");

        try{
            for (let m of nArbol.getInstrucciones()){
                m.setPasada(2);
                if(m instanceof Excepcion){ // ERRORES SINTACTICOS
                    //Errors.push(m);
                    nArbol.addError(m);
                    nArbol.updateConsola((<Excepcion>m).toString());
                    /*
                    let lista:Array<Instruccion>= nArbol.getInstrucciones(); //Buscar index de instrucciones con errores
                    let index: number = lista.findIndex(lista => lista === m);
                    if (index != -1) {
                        instruccionesEliminar.push(index);
                        //ast.getInstrucciones().splice(index, 1);
                    }   
                    */
                   continue;
                }
                var result = m.interpretar(nArbol, nTabla);
                if(result instanceof Excepcion){ // ERRORES SEMÁNTICOS
                    //Errors.push(result);
                    //nArbol.addError(result);
                    //nArbol.updateConsola((<Excepcion>result).toString());
                    return result;
                }       
                if (result instanceof CONTINUE){
                    return result;
                }      
                if (result instanceof BREAK){
                    return result;
                }  
                if (result instanceof RETURN){
                    return result;
                }                 
            }          
            /*               
            let corrimiento:number = 0;
            for (let index of instruccionesEliminar){
                index -= corrimiento;
                nArbol.getInstrucciones().splice(index, 1); //Eliminar instrucciones con errores
                corrimiento++;
            }     
            */              
        }catch(err){
            console.log(err);
        }
        return true;

    }
}
