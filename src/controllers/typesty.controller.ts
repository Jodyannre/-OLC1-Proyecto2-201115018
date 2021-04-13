import {Request,Response} from 'express';
import Excepcion from './analizador/Excepciones/Excepcion';
import Arbol from './analizador/tablaSimbolos/Arbol';
import tablaSimbolos from './analizador/tablaSimbolos/tablaSimbolos';

var Errors:Array<Excepcion> = new Array<Excepcion>();

class typestyController{

    public helloWorld (req:Request,res:Response){
        res.send("Hola Mundo");
    }
    public interpretar (req:Request,res:Response){
        var parser = require('./analizador/gramatica/gramatica');
        const texto = req.body.contenido;
        //parser.parse(texto);
        //console.log(texto);
        //var entero = parser.parse(texto);
        //console.log(entero.getValor());


        try{
            let ast = new Arbol( parser.parse(texto) );

            var tabla = new tablaSimbolos();
            ast.setGlobal(tabla);

            for(let m of ast.getInstrucciones()){

                if(m instanceof Excepcion){ // ERRORES SINTACTICOS
                    Errors.push(m);
                    ast.updateConsola((<Excepcion>m).toString());
                }
                var result = m.interpretar(ast, tabla);
                if(result instanceof Excepcion){ // ERRORES SINTACTICOS
                    Errors.push(result);
                    ast.updateConsola((<Excepcion>result).toString());
                }
            }
            res.json({consola:ast.getConsola(), Errores: Errors});
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
    
}   

export const controller = new typestyController();

