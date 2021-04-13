//var Parser = require('../../JavaScript/parser'); //ubicación del método de parseo.
var main = require('../../instrucciones/main_INST');
var c3d = require("../../C3D/generarCodigoC3D");
var ejecutar_c3d = require("../../C3D/ejecutarC3D");
var TS = require("../../arbol/TS");
var AWS = require("aws-sdk");
var c = require("../../arbol/constants");
//const fs = require('fs');

exports.CONT = 0;

//funcion que lee la data de la tabla del debug /linea-codigo
exports.getDebugStack = (req, h) => {
    //console.log("llamada a getDebug");
    var ret = "";
    for (var i = 0; i < TS.TS_debug.length; i++) {
        var tmp_obj = TS.TS_debug[i];
        //el tipo significa que viene Stack o Heap o Temporal
        if (tmp_obj.tipo == c.constantes.T_STACK) { //la posición es la posición en la estructura ya sea del heap o del stack
            //console.log("linea: " + tmp_obj.linea + " \nvalor: " + tmp_obj.valor + "\nposicion: " + tmp_obj.pos + "\n");
            ret += tmp_obj.linea + "|" + tmp_obj.valor + "|" + tmp_obj.pos + "$";
        }
    }
    return ret;
}

exports.getDebugHeap = (req, h) => {
    //console.log("llamada a getDebug");
    var ret = "";
    for (var i = 0; i < TS.TS_debug.length; i++) {
        var tmp_obj = TS.TS_debug[i];
        //el tipo significa que viene Stack o Heap o Temporal
        if (tmp_obj.tipo == c.constantes.T_HEAP) {
            //console.log("linea: " + tmp_obj.linea + " \nvalor: " + tmp_obj.valor + "\nposicion: " + tmp_obj.pos + "\n");
            ret += tmp_obj.linea + "|" + tmp_obj.valor + "|" + tmp_obj.pos + "$";
        }
    }
    return ret;
}

exports.getDebugTemp = (req, h) => {
    //console.log("llamada a getDebug");
    var ret = "";
    for (var i = 0; i < TS.TS_debug.length; i++) {
        var tmp_obj = TS.TS_debug[i];
        //el tipo significa que viene Stack o Heap o Temporal
        if (tmp_obj.tipo == c.constantes.T_TMP) { //los temporales no tienen posición en ninguna estructura
            //console.log("linea: " + tmp_obj.linea + " \nvalor: " + tmp_obj.valor + "\ntemporal: "+tmp_obj.tmp+"");
            ret += tmp_obj.linea + "|" + tmp_obj.valor + "|" + tmp_obj.tmp + "$";
        }
    }
    return ret;
}


/**
 * llamada al parser
*/
exports.parsear = (req, h) => {
    var input = req.payload;
    main.compilar(input);
    return true;
}
//ejecutar codigo 3D
exports.ejecutar = (req, h) => {
    var input = req.payload;
    ejecutar_c3d.ejecutar(input);   //ejecutar codigo.
    
    return true;
}

//obtiene el arreglo stack
exports.getStack = (req, h) => {
    return ejecutar_c3d.recorrer_stack();          //recorrer stack
}

//obtiene el arreglo heap
exports.getHeap = (req, h) => {
    return ejecutar_c3d.recorrer_heap();
}

//obtiene los temporales
exports.getTemporales = (req, h) => {
    return ejecutar_c3d.recorrer_temporales();
}  

//obtiene la información para regresarla a la consola
exports.getConsola = (req, h) => {
    return "se parseó";
}

exports.getConsola3D = (req, h) => {
    return c3d.getConsola();
}


//obtiene la cadena de c3d
exports.getCodigo3D = (req, h) => {
    return c3d.codigo;
}

exports.pila_reporteAST = pila_reporteAST = [];

/*exports.getAST = (req, h) =>{

 AWS.config.update( {
            region: 'us-east-1',
            endpoint : 'https://dynamodb.us-east-1.amazonaws.com'
    });

    var dynamodb = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName : 'graph'
    };
    
    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error("error no se pudo hacer la consulta con la BD para obtener las imagenes", JSON.stringify(err, null, 2));
        } else {
           data.Items.forEach(function(i){
                console.log("estoy aqui "+i.data);
                //return i.data;

                //exports.pila_reporteAST.push(i.data);
                //fin = i.data;
            });

           // exports.pila_reporteAST.push(data.Item.data);
            //exports.buscarImagen(data.Item);
            //return data.Item.data;
            //exports.pila_reporteAST = data.Items;
        }
    });
   
    //console.log(fin);
    return "";
}*/



//obtiene la información de la tabla de símbolos
exports.getTS = (req, h) => {
    var body = "<tr><th>Tipo de Modificador</th><th>Tipo</th><th>Nombre</th><th>Hereda de</th><th>Dimensión</th><th>Posición</th><th>Ámbito</th><th>No. Parámetros</th><th>Tipo parámetros</th><th>padre</th><th>miembro</th></tr>";
    var json_objeto;
    
    if(TS.TS_classes != undefined){
        for(var i = 0; i < TS.TS_classes.length; i++){
            json_objeto = TS.TS_classes[i];
            //lista de modificadores
            body += "<tr><td>"+getModificadores(json_objeto)+"</td>";
            body += "<td>clase</td><td>"+json_objeto.ID+"</td><td>"+json_objeto.heredade+"</td>"; //termina info de la clase
            body += "<td>---</td><td>---</td><td>---</td><td>---</td><td>---</td><td>---</td><td>---</td></tr>";
            var tmp_global;
            var j;
            if(json_objeto.l_global != undefined){
                for(j = 0; j < json_objeto.l_global.length; j++){ //recorrer las declaraciones globales
                    tmp_global = json_objeto.l_global[j];
                    //lista de modificadores
                    body += "<tr><td>"+getModificadores(tmp_global)+"</td>";
                    //lista de tipos de una variable global
                    body += "<td>"+transformar_tipos(tmp_global.tipo)+"</td>"; 
                    body += "<td>"+tmp_global.ID+"</td>";   //nombre de la variable global
                    body += "<td>"+json_objeto.heredade+"</td>";
                    body += "<td>"+tmp_global.dimen+"</td>";
                    body += "<td>"+tmp_global.pos+"</td>";
                    body += "<td>"+transformar_ambito(tmp_global.ambito)+"</td>"; 
                    body += "<td>---</td>;"; 
                    body += "<td>---</td>;"; 
                    body += "<td>"+json_objeto.ID+"</td>";
                    if(json_objeto.miembro != undefined){
                        body += "<td>"+json_objeto.miembro+"</td>";
                    }else{
                        body += "<td>false</td>";
                    }
                }
            }
            if(json_objeto.l_funciones != undefined){
                for(j = 0 ; j < json_objeto.l_funciones.length; j++){ //recorrer las funciones
                    tmp_global = json_objeto.l_funciones[j];
                    body += "<tr><td>"+getModificadores(tmp_global)+"</td>";
                    body += "<td>"+transformar_tipos(tmp_global.tipo)+"</td>";
                    body += "<td>"+tmp_global.ID+"</td>";
                    body += "<td>"+json_objeto.heredade+"</td>";
                    body += "<td>"+tmp_global.dimen+"</td>";
                    body += "<td>---</td>";
                    body += "<td>"+transformar_ambito(tmp_global.ambito)+"</td>";
                    body += "<td>"+tmp_global.no_params+"</td>";
                    body += "<td>"+getTiposParametros(tmp_global)+"</td>";
                    body += "<td>"+json_objeto.ID+"</td>";
                    if(json_objeto.miembro != undefined){
                        body += "<td>"+json_objeto.miembro+"</td></tr>";
                    }else{
                        body += "<td>false</td></tr>";
                    }
                }
            }
            if(json_objeto.l_miembros != undefined){
                for(miembro of json_objeto.l_miembros){
                    TS.TS_classes.push(miembro);
                }
                continue;
            }
        }
        var finbody = "<table>"+body+"</table>";
        almancenarDynamoBD("tabla_simbolos",exports.CONT++,finbody, "No se pudo almacenar esta informacion en la tabla de simbolos");
        return finbody;
    }
}
//obtiene la lista de los tipos de parametros
function getTiposParametros(tmp_global){
    var body = "";
    if(tmp_global.params != undefined){
        for(var k = 0 ; k < tmp_global.params.length; k++){
            body += transformar_tipos(tmp_global.params[k].tipo)+"_";
        }
       body = body.substring(0, body.length-1);
    }else{
        body = "---"; 
    }
    return body; 
}
//obtiene la lista de modificadores de las funciones o clases
function getModificadores(json_objeto){
    var body = "";
    if(json_objeto.l_modificadores != undefined){
        var tmp;
        if(json_objeto.l_modificadores[0] != undefined && json_objeto.l_modificadores[0] == c.constantes.T_PUBLIC){
            return "public";
        }
        for(var j = 0 ; j < json_objeto.l_modificadores.length; j++){ //recorrer los modificadores de la clase
            tmp = json_objeto.l_modificadores[j];
            if(tmp != undefined){
                body += transformar_modificadores(tmp[0])+"_";
            }else{
                body += "public";
            }
        }
        return body.substring(0, body.length-1);
    }else{
        body = "---"; 
    }
    return body;
}

//funcion que transforma los numeros de ambito a sus palabras
function transformar_ambito(ambito){
    if(ambito == c.constantes.T_GLOBAL){
        return "global";
    }else{
        return "local";
    }
}

//funcion que transforma los numeros de los modificadores a sus palabras
function transformar_modificadores(mod){

    switch(mod){
        case c.constantes.T_PUBLIC:
            return "public";
        case c.constantes.T_PRIVATE:
            return "private";
        case c.constantes.T_PROTECTED:
            return "protected";
        case c.constantes.T_STATIC:
            return "static";
        case c.constantes.T_ABSTRACT:
            return "abstract";
        case c.constantes.T_FINAL:
            return "final";    
    }

}
//funcion que transforma los numeros de los tipos a sus palabras
function transformar_tipos(tipo){
    switch(tipo){
        case c.constantes.T_ENTERO:
            return "int";
        case c.constantes.T_DECIMAL:
            return "double";
        case c.constantes.T_CARACTER:
            return "char";
        case c.constantes.T_BOOLEANO:
            return "boolean";
        case c.constantes.T_CADENA:
            return "String";
        case c.constantes.T_LINKEDLIST:
            return "LinkedList";
        default:
            return tipo;
    }
}

//obtener los errores si los hubiera
exports.getTablaErrores = (req, h) => {
    var bodyTerrores = "<tr><th>Tipo</th><th>Línea</th><th>Columna</th><th>Descripción</th></tr>";

    //se obtienen los errores
    if (TS.TS_Errores != undefined) {
        var json_objeto;
        for (i = 0; i <TS.TS_Errores.length; i++) {
            json_objeto = TS.TS_Errores[i];
            bodyTerrores += "<tr><td>" + json_objeto.tipo + "</td><td>" + json_objeto.linea + 
            "</td><td>" + json_objeto.columna + "</td><td>"+json_objeto.descripcion+"</td></tr>";
        }
    }
    var finbodyTerrores =  "<table>"+ bodyTerrores+ "</table>";
    almacenarDynamoError("errores", exports.CONT++ ,finbodyTerrores,"No se pudo almacenar los errores");

    return finbodyTerrores;
}


function almancenarDynamoBD(tablename, idtable, tabledata, error_t){
    
    AWS.config.update( {
        region: 'us-east-1',
        endpoint : 'https://dynamodb.us-east-1.amazonaws.com'
      });
      
    var dynamodb = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName : tablename,
        Item:{
            "t_tabla" : idtable.toString(),
            "data" : tabledata
        }
    };
    dynamodb.put(params, function(err, data) {
        if (err) {
            console.error(error_t, JSON.stringify(err, null, 2));
        } else {
            console.log("data almacenada");
        }
    });
}

function almacenarDynamoError(tablename, idtable, tabledata, error_t){
    AWS.config.update( {
        region: 'us-east-1',
        endpoint : 'https://dynamodb.us-east-1.amazonaws.com'
      });
      
    var dynamodb = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName : tablename,
        Item:{
            "t_error" : idtable.toString(),
            "data" : tabledata
        }
    };
    dynamodb.put(params, function(err, data) {
        if (err) {
            console.error(error_t, JSON.stringify(err, null, 2));
        } else {
            console.log("data almacenada");
        }
    });
}