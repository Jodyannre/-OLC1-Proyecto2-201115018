import {Request,Response} from 'express';
import Excepcion from './analizador/Excepciones/Excepcion';
import Arbol from './analizador/tablaSimbolos/Arbol';
import tablaSimbolos from './analizador/tablaSimbolos/tablaSimbolos';
import {Instruccion} from './analizador/Abstract/Instruccion';
import { nodoInstruccion } from "./analizador/Abstract/nodoInstruccion";
import Asignacion from "./analizador/Expresiones/Asignacion";
const { exec } = require("child_process");
var Errors:Array<Excepcion> = new Array<Excepcion>();

class typestyController{
    private static contadorEstados:number = 0;
    private static grafo:string;
    private static fs = require('fs');

    public helloWorld (req:Request,res:Response){
        res.send("Hola Mundo");
    }
    public interpretar (req:Request,res:Response){
        var parser = require('./analizador/gramatica/gramatica');
        const texto = req.body.contenido;
        var instruccionesEliminar:number[] = [];

        try{
            let ast = new Arbol( parser.parse(texto) );

            var tabla = new tablaSimbolos(0);
            ast.setGlobal(tabla);

            for(let m of ast.getInstrucciones()){
                if (m instanceof Asignacion){
                    continue;
                }
                m.setPasada(0);
                if(m instanceof Excepcion){ // ERRORES SINTACTICOS
                    Errors.push(m);
                    ast.updateConsola((<Excepcion>m).toString());
                    let lista:Array<Instruccion>= ast.getInstrucciones(); //Buscar index de instrucciones con errores
                    let index: number = lista.findIndex(lista => lista === m);
                    if (index != -1) {
                        instruccionesEliminar.push(index);
                        //ast.getInstrucciones().splice(index, 1);
                    }
                }
                var result = m.interpretar(ast, tabla);
                if(result instanceof Excepcion){ // ERRORES SINTACTICOS
                    Errors.push(result);
                    ast.updateConsola((<Excepcion>result).toString());
                    let lista:Array<Instruccion>= ast.getInstrucciones(); //Buscar index de instrucciones con errores
                    let index: number = lista.findIndex(lista => lista === m);
                    if (index != -1) {
                        instruccionesEliminar.push(index);
                        //ast.getInstrucciones().splice(index, 1);
                    }
                }
            }
            let corrimiento:number = 0;
            for (let index of instruccionesEliminar){
                index -= corrimiento;
                ast.getInstrucciones().splice(index, 1); //Eliminar instrucciones con errores
                corrimiento++;
            }
            instruccionesEliminar = [];
            for(let m of ast.getInstrucciones()){
                m.setPasada(1);
                var result = m.interpretar(ast, tabla);
                if(result instanceof Excepcion){ // ERRORES SEMÁNTICOS
                    Errors.push(result);
                    ast.updateConsola((<Excepcion>result).toString());
                    let lista:Array<Instruccion>= ast.getInstrucciones(); //Buscar index de instrucciones con errores
                    let index: number = lista.findIndex(lista => lista === m);
                    if (index != -1) {
                        instruccionesEliminar.push(index);
                        //ast.getInstrucciones().splice(index, 1);
                    }
                }
            }
            corrimiento = 0;
            for (let index of instruccionesEliminar){
                index -= corrimiento;
                ast.getInstrucciones().splice(index, 1); //Eliminar instrucciones con errores
                corrimiento++;
            }  
            
            
            //Ultima pasada
            /*
            instruccionesEliminar = [];
            for(let m of ast.getInstrucciones()){
                if (m instanceof Asignacion){
                    continue;
                }
                m.setPasada(2);
                var result = m.interpretar(ast, tabla);
                if(result instanceof Excepcion){ // ERRORES SEMÁNTICOS
                    Errors.push(result);
                    ast.updateConsola((<Excepcion>result).toString());
                    let lista:Array<Instruccion>= ast.getInstrucciones(); //Buscar index de instrucciones con errores
                    let index: number = lista.findIndex(lista => lista === m);
                    if (index != -1) {
                        instruccionesEliminar.push(index);
                        //ast.getInstrucciones().splice(index, 1);
                    }
                }
            }
            corrimiento = 0;
            for (let index of instruccionesEliminar){
                index -= corrimiento;
                ast.getInstrucciones().splice(index, 1); //Eliminar instrucciones con errores
                corrimiento++;
            } 
            */
            res.json({consola:ast.getConsola(), Errores: Errors});
            console.log(ast.getConsola());

            //Creando gráfica del ast despues lo trabajo

            
            let nodoInicial:nodoInstruccion = new nodoInstruccion("Raiz");
            let nodoIns:nodoInstruccion = new nodoInstruccion("INSTRUCCIÓN");
            let temp:any;
            for (let instruccion of ast.getInstrucciones()){
                temp = instruccion;
                nodoIns.agregarHijoNodo(temp.getNodoInstruccion());
            }
            nodoInicial.agregarHijoNodo(nodoIns);
            nodoInicial = nodoIns;

            typestyController.graficarAST(nodoInicial);
            console.log(ast.getConsola());
            
        }
        catch(err){
            console.log(err);
            res.json({
                salida : err,
                errores : err
            });
        }


        
    }


    public static graficarAST(raiz:nodoInstruccion){
        let nombreSalida:string = "arbol";
        //let contenido:string = this.crearDot(raiz);
        //let buffer = this.strToBuffer(contenido);
        var fs = require('fs');

        try{
            fs.writeFileSync(nombreSalida+".dot",this.crearDot(raiz),function(err:any) {
                if (err) {
                    console.log(err);
                    return console.error(err);
                }
                console.log("Archivo creado!");
            });

        }catch(err){
            console.log(err);
        }

        this.exec("dot -Tsvg arbol.dot -o ./dist/public/images/arbol.svg"); //Código para crear el svg  

    }

    public static crearDot(raiz:nodoInstruccion){

        this.grafo = "";
        this.grafo += "digraph {\n";
        this.grafo += "n0[label=\"" + raiz.getValor().replace("\"", "\\\"") + "\"];\n"
        this.contadorEstados++;
        this.recorrerAST("n0",raiz);
        this.grafo += "}";
        return this.grafo;
    }

    public static recorrerAST(padre:string,nodoPadre:nodoInstruccion){

        for (let hijo of nodoPadre.getHijos()){
            let nombreHijo:string = "n" + this.contadorEstados;
            this.grafo += nombreHijo + "[label=\"" + hijo.getValor().replace("\"", "\\\"") + "\"];\n";
            this.grafo += padre + "->" + nombreHijo + ";\n";
            this.contadorEstados++;
            this.recorrerAST(nombreHijo,hijo);
        }
    }

    public static exec(cmd:string){
        var exec = require('child_process').exec;
        
        exec(cmd, function(error:any, stdout:any, stderr:any) {
          console.log("Ejecutado");
        });    
        
    }

    public static strToBuffer(str:string):ArrayBuffer {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes por cada char
        var bufView = new Uint16Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return buf;
      }
    
}   

export const controller = new typestyController();

