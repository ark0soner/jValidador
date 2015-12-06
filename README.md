ValidadorJida
=============
Validador para Formularios con Javascript y jquery 
____

**jvalidador.js** es un objeto javascript que permite realizar validaciones completas
de formularios estaticos a partir de una configuración por medio de JSON.


## Configuración para facil uso

Debes incluir la libreria Jquery 1.8 o superior y el archivo del validador Jida.  
```
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script src="jValidador.min.js"></script>
<script>
$( document ).ready(function(){
	$("#idBoton").jValidador({
			validaciones:{
							'idCampo1' : {"validacion" : {"configuracion":"valorConfiguracion"}
						}
	})
 	
});
</script>
```


## Breve Documentación 


### Validaciones 
El validador, al igual que el **JidaControl.js** tiene una serie de validaciones por defecto
las cuales son :

* **obligatorio** : Valida campos obligatorios
* **documentacion**: Valida documentación de rif o cédula en Venezuela
* **telefono** : Valida formato para telefonos (Venezuela)
* **email** : Valida campos para correos de teléfono
* **numerico** : Valida campos solo númericos sin decimale
* **decimal** : Valida campos númericos con decimales
* **caracteres** : Valida campos que solo contengan caracteres
* **celular** : Valida tormato para celulares (Venezuela)
* **caracteresEspeciales** : Valida caracteres especiales *usado para validaciones compuestas*
* **documentacion** : Valida documentos de identificación, como RIF o Cedula (Venezuela)
* **programa**: solo permite caracteres que permitan formar nombres de variables 
* **numero** : Campo númerico, *usado para validaciones compuestas*
* **caracteresEsp** : *usado para validaciones compuestas*
* **internacional**: Telefonos internacionales *usado para validaciones compuestas*

Las validaciones en su mayoria son realizadas por medio de expresiones regulares, las cuales se encuentran
en el array *jd.validaciones*.

### Parametros 


El jValidador puede ser inicializado via javascript o por medio de atributos data, recibe un json
con los parametros de configuración. 
las opciones son:
 

Parametros		| Detalle
----------------|--------------
 **validaciones**	| arreglo de validaciones por campo, el unico valor obligatorio. Si no es pasado será intentado tomar del atributo data-validacion de cada campo
 **funcionError** 		| Función Controladora para el manejo de errores, por defecto trae una.
 **cssError**	| clase css a agregar en el div que muestra los errores, por defecto es "div-error" 
 **post** | Nombre de función o funcion a ejecutar despues de la validacion
 **prev** 	| nombre de función o funcion a ejecutar antes de las validaciones 
 

## JSON Options

Solo serán validados los campos cuyos ids sean pasados en el json de opciones o cuyo selector contenga el attr data-validacion. ASimismo, cada campo
pasado es una clave que recibe un json con las validaciones para el campo.


## Personalizar el Validador

Si se desean agregar validaciones adicionales o personalizadas, puedes hacerlo de las siguientes formas

###Funcion Externas

El validador puede recibir una validacion "externa" la cual puede una expr. o una funcion ambas
especificadas por separado.
```
{
	'campo':{'externa':{expr:/tuexp/,'mensaje':'mensaje de error}
}
```
o
```
{
	'campo':{'externa':{
							funcion:function($campo){
								// tu funcion de validacion aqui
							}
						}
}
```
### Personalizar el jValidador

Si deseas manejar validaciones espeficas en todo tu proyecto tambien puedes personalizar el validador
agregando expresiones o funciones al prototype.
```
jValidador.validaciones.tuexpresion:{expr:/tuexp/,mensaje:"Mensaje por defecto"}
```
o
```
jValidador.tufuncion = function($campo,$arr){

// el codigo de la nueva funcion aqui
}
```
### Funciones

Si consideras que la validación no puede ser realizada con una exp. regular, puedes agregar una
función al prototype del jd.validador, con el nombre que desees. Luego puedes usar ese nombre
para llamar a la validación.


### Funciones y expresiones Regulares.

Puedes crear multiples expresiones regulares o unir las que ya están declaradas para
realizar la validación en una función. El metodo por defecto para ejecutar validaciones
con exp. regulares es **ejecutarValidacion**, al cual puedes acceder por medio del prototype.