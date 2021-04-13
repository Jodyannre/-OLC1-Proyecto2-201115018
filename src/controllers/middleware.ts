import {Request,Response} from 'express';



//Clase para recibir datos que se van a analizar en el jison
class prueba {

    public imprimir(req:Request,res:Response){
        console.log(req.body.contenido);
    }
}

export const prove = new prueba();
