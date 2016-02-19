/**
 * JidaFramework : validador v1.0
 * 
 * @author @ark0soner
 * www.jidadesarrollos.com.ve
 * Copyright 2012 - 2016
 *  
 */
(function($){
     /**
     * 
     *  Objeto jValidador
     */
    jValidador = function(ele,config,e){
        this._default ={
           funcionError : this.mensajeError,
           totalError:false, //si se coloca en true se mostrará un solo sms con todos los errores,
           divError:false,
           cssError:'div-error',
           vControl:true,
           post:false,
           prev:false,
           validaciones:false,
           form:false,
           campo:false,
           viaData:false
        };
        
        if(ele){
            this.$ele = $(ele);
            this.config = config;
            this.errores = new Object();    
    
            
            if(typeof this.config== 'object') this.config = $.extend(this._default,this.config);
            
            else this.config = this._default;
            if(this.config.campo){
                
                this.$ele = $( ele );
                var jvalidador = this;
                var vj = jvalidador;
                this.initInput();
            }else{
                
                this.$ele.data('config',this.config);
                if(!this.config.form){
                    this.$form = $(this.$ele[0].form);
                    
                }else
                    this.$form = $("#"+this.config.form);
                
                this.$ele.data('jd.validador',this);
                this.$form.data('jd.validador',this);
                var jvalidador = this;
                var vj = jvalidador;
                if(!this.init()) e.preventDefault();
            }
            
                
            
        }else{
            console.log("ele is FALSE");
        }        
        
        
    };
    jValidador.VERSION='1.1';
    var jdValidador = '[data-jida="validador"]';
    jValidador.replaceAll = function(value,charte,valorReplace){
        if(!valorReplace)
            valorReplace ="";
        var result = value;
        var posi = value.indexOf(charte);
        if(posi > -1) {
            while(posi > -1){
                result = value.substring(0,posi);
                result = result + valorReplace +value.substring(posi+1);
                posi = result.indexOf(charte);
                this.errores=TRUE;
                value = result;
            }
        }
            return(result);
    };//final funcion
    $.fn.validadorJida = jPlugin;
    jValidador.prototype = {
        /**
         * Esta funcion es ejecutada solo si el validador es instanciado sobre
         * un solo campo a ser validado. 
         */
        initInput:function(e){
            $ele = this.$ele;
            bandera=true;
            jv = this;
            
            if($ele.data('validacion') && bandera===true){
                //console.log($ele);
                if(!jv.validar($ele,jv.verificarValidaciones($ele.data('validacion')))){
                    eval(jv.config.funcionError).call(this,$ele);
                    jv.erroresCampo=true;
                    bandera=false;
                    return bandera;
                }
            }
            //console.log($ele.data('validacion'));
            return bandera;
        },
        erroresCampo:false,
        init :function(e){
            
            var $btn = this.$ele;
            jv = $btn.data('jd.validador');
            
            jv.errores = new Object();
            bandera=true;
            
            if(jv.validarFuncionesExternas('prev')){
                var $formulario = this.$form;
                /**
                 * @var boolean bandera Encendida si no se encuentran errores 
                 */
                var bandera = true;
                if(typeof $formulario != 'undefined' || typeof $formulario.elements!='undefined'){
                    $.each($formulario[0].elements, function(index, ele) {
                        var $ele = $( ele );
                        var validacionesCampo = jv.obtValidacionesCampo($ele);                        
                        if(validacionesCampo && bandera===true){
                            if(!jv.validar($ele,jv.verificarValidaciones(validacionesCampo))){
                                                                       
                                if(!jv.totalErrores) jv.config.funcionError.call(this,$ele,jv);
                                
                                bandera=false;
                                return bandera;
                            }
                        }
                    });
                    if(bandera) bandera = jv.validarFuncionesExternas('post');
                    
                }
            }
            return bandera;
        },
        /**
         * Obtiene las validaciones de un campo dado
         * @method obtValicacionCampo
         *  
         */
        obtValidacionesCampo : function($ele){
            
            if(this.config.viaData){
                return $ele.data('validacion');
            }else{
                if(this.config.validaciones[$ele.attr('id')]!='undefined')
                    return this.config.validaciones[$ele.attr('id')];
                else{
                    return false;
                }
            }
        },
        /**
         * Valida si se debe ejecutar una función antes del validador
         */
        validarFuncionesExternas : function(tipo){
            
            if(this.config[tipo]!=false  && typeof(this.config[tipo]) !='undefined'){
                if(typeof this.config[tipo]=='string'){
                    result = eval(this.config[tipo]).call(this,jv.$form);
                }else{   
                    result = this.config[tipo].call(this);
                }
                return result;
            }else{
                return true;
            }
            
        },
        validar:function($ele,validaciones){
            
            var bandera=true;
            if(validaciones.obligatorio==true || typeof validaciones.obligatorio=='object'){
                bandera = jv.obligatorio($ele,validaciones.obligatorio);
                 
            }
            if(bandera){
                
                
                $.each(validaciones,function(validacion,params){
                    type = typeof(parametros);
                    if(params!=false && bandera==true && validacion!='obligatorio'){
                        if(jv[validacion]){
                            if(!jv[validacion]($ele,validacion,params)){
                                jv.errores[$ele.attr('id')]=validacion;
                                bandera=false;
                            }
                        }else
                        if(jValidador.validaciones[validacion]){
                            if(!jv.ejecutarValidacion($ele,validacion)){
                                jv.errores[$ele.attr('name')]=validacion;
                                bandera=false;
                            }
                        }else{
                          console.log(validacion);
                          console.log(params)
                          throw new Error("No existe la validacion solicitada "+ validacion+" para el campo "+$ele.attr('id'));   
                        }
                        
                    }
                });
                
            }else{
                
                jv.errores[$ele.attr('id')]='obligatorio';
            }
            
            return bandera;
            
         },
         /**
          * Ejecuta una funcion externa como parte del validador
          * @method externa
          *  
          */
         externa:function($ele,validacion,params){
            
            if(params.funcion){ 
                return params.funcion.call(this,$ele,validacion,params);
            }if(params.expr){
            
                return this.ejecutarValidacion($ele,validacion,params.expr);
            }else{
                throw new Error("No se ha formulado correctamente la validacione xterna"+ validacion);   
           }
         },
         expr:function($ele,validacion,params){
            
             return this.ejecutarValidacion($ele,validacion,params.expr);
             
         },
         /**
         * Ejecuta las validaciones estandar
         * 
         * Hace uso de la expresión regular correspondiente a la validacion
         * la expresión regular debe encontrarse en el objeto validaciones 
         *
         */
        ejecutarValidacion:function($campo,validacion,expresion){
            
            if(!expresion) expresion = jValidador.validaciones[validacion].expr;
            
            var valorCampo = $campo.val();
            if(validacion=='numerico' || validacion=='decimal'){
                //Si el campo es numerico se eliminan los formatos de miles
                valorCampo=jValidador.replaceAll(valorCampo,'.');
                if(validacion=='decimal'){
                //Si el campo es decimal se cambia la coma de decimal por el punto
                    valorCampo.replace(",",".");
                }
            }
            if(valorCampo!=""){
                if(expresion.test(valorCampo)) return true; 
                else return false;
            }else{
                return true;
            }//fin validacion
            
        },
        /**
         * Función por defecto para mostrar mensaje de error del formulario
         * @method mensajeError
         * @param object $campo Objeto jQuery del campo validado
         * @params object objeto jValidador
         */
        mensajeError:function($campo,vj){
            
            
            if($campo){
                
                $input = $campo;
                
                var errorCampo = jv.errores[$campo.attr('id')];
                
                var validacionesCampo = vj.obtValidacionesCampo($campo);
                var msj="";
                var divError = vj.$form.find("."+vj.config.cssError);
                if(validacionesCampo[errorCampo]!= undefined){
                
                    msj = (validacionesCampo[errorCampo].mensaje)?validacionesCampo[errorCampo].mensaje:jValidador.validaciones[errorCampo].mensaje;    
                }else{
                    msj = jValidador.validaciones[errorCampo].mensaje;
                    
                }
                if(divError.size()>0){
            
                    //$input = this.$form.find('[name="'+$campo.attr('name')+'"]');
                    if($input.parent().hasClass('control-multiple')){
                        $input.focus().parent().before(divError.html(msj).show());
                        $('html,body').animate({
                            scrollTop: $input.offset().top - 200
                        });    
                    }else{
                        $input.focus().before(divError.html(msj).show());
                        $('html,body').animate({
                            scrollTop: $input.offset().top - 200
                        });    
                    }
                        
                }else{
                    $divError = $("<div></div>").addClass(jv.config.cssError).html(msj);
                    vj.$form.on('click',function(e){
                    
                        if($(e.target).attr('id')!= jv.$ele.attr('id')){
                            $divError.fadeOut();
                        }
                    });
                    //$input = this.$form.find('[name="'+$campo.attr('name')+'"]');
                    if($input.parent().hasClass('control-multiple')){
                        $input.focus().parent().before($divError).show();
                        //$(window).scrollTop($input.position().top - 200);
                        $('html,body').animate({
                            scrollTop: $input.offset().top - 200
                        });
                    }else{
                        $input.focus().before($divError).show();
                        $('html,body').animate({
                            scrollTop: $input.offset().top - 200
                        });    
                    }
                    
                        
                }
                console.log(msj);
            }
            
            
        },
        /**
         * Verifica las validaciones pasadas para el campo y estandariza la forma
         * @method verificarValidaciones 
         */
        verificarValidaciones:function(validaciones){
            var validacionesDefault = {
                numerico:false,
                documentacion:false,
                obligatorio:false,
                caracteres:false
            };
            
            if(typeof validaciones!='undefined'){
                
                if(validaciones instanceof Array){
                    newObject =Object();
                    $.each(validaciones,function(key,val){
                       newObject[val]=true; 
                    });
                    validaciones = newObject;
                }
                
                return $.extend(validacionesDefault,validaciones);    
            }else{
                return validacionesDefault;
            }
            
            
        },
       /**
         * Validar si el control ha sido llenado
         * 
         * Verifica que se haya ingresado algún dato en el control
         * @return array resp arreglo{
         *      @var boolean resp.val false=>Error true=>bien
         *      @var string message => Mensaje de error
         * }
         */
        obligatorio:  function($campo,arr){//VALIDAR SI UN CAMPO ESTA VACIO;
            
            if(typeof arr.evaluacion =='undefined') arr.evaluacion = 'igual';
            var tipoCampo = $campo.attr('type');
            if($campo.attr('id')=='montoPago'){
                
            }
            
            var condicion=true;
            if(arr.condicional){
                    var valor;
                    var $condicional =  $("#"+arr.condicional);
                    
                    if(arr.tipo && arr.tipo=="radio" || $condicional.attr('type')=='radio'){  
                            
                          nombreCampo =$condicional.attr('name');
                          valor = $("input[name="+nombreCampo+"]:checked").val();
                          
                        }else{
                          valor = $condicional.val();
                        }
                    condicion=false;
                    switch(arr.evaluacion){
                        case 'igual':
                            if(valor==arr.condicion) condicion=true;    
                        break;
                        case 'diff':
                            if(valor!=arr.condicion) condicion=true;
                        break;
                        case 'mayor':
                            if(valor>arr.condicion) condicion=true;
                        break;
                        case 'menor':
                        if(valor<arr.condicion) condicion=true;
                        break;
                    }
                    
                    
            }else condicion=true;
            if(condicion===true){
                    switch (tipoCampo){
                        case 'RADIO':
                        case 'radio':
                        case 'CHECKBOX':
                        case 'checkbox':
                            nombreCampo = $campo.attr('name');
                            //if($campo.prop('checked')){
                            //resp.radio=true;
                            if($('input[name="'+nombreCampo+'"]:checked').length>0){  
                                
                                resp= true;
                            }else{    
                                resp=false;
                            }
                            
                            break;
                        default:
                            if($campo.val()=="") resp=false;
                            else  resp=true;
                            
                        break;  
                        }//final switch========================
                    
            }else  resp=true;
            
            return resp;
        },
        documentacion:function($campo,validacion,parametros){
                
            var expresion = jValidador.validaciones[validacion].expr;
            var valorCampo = $campo.val();
            if(parametros.campo_codigo){
                valorCampo = $campo.prev().val()+valorCampo;   
            }
            
            if(valorCampo!=""){
                
                if(expresion.test(valorCampo)) return true; 
                else    return false;    
            }else{
                return true;
            }//fin validacion
            
        },
        telefono:function($campo,validacion,parametros){
            var totalDigitos =11;
            var codigo="";
            var extension="";
            var expresionTlf=jValidador.validaciones['telefono'].expr;
            var expresionCel=jValidador.validaciones['celular'].expr;
            var expresionInter=jValidador.validaciones['internacional'].expr;
            
            var valorCampo = $campo.val();
            
            if(parametros.code){
                codigo = $("#"+$campo.attr('id')+"-codigo").val();
                jv.divMsjError  = "#box"+jValidador.replaceAll($campo.attr('id'),"#","");
            } 
            if(parametros.ext){
                totalDigitos+=4;
                extension=$("#"+$campo.attr('id')+"-ext").val();
            }
    
            valorCampo = codigo+valorCampo+extension;
            if(valorCampo!=""){
                
            
                var celularValido = (expresionCel.test(valorCampo))?1:0;
                var TelefonoValido = (expresionTlf.test(valorCampo))?1:0;
                var internacionalValido =(expresionInter.test(valorCampo))?1:0;
                if( parametros.tipo && (parametros.tipo=='telefono' && TelefonoValido==1 ||    
                    parametros.tipo=='celular' && celularValido==1 ||
                    parametros.tipo=='internacional' && internacionalValido==1 || 
                    parametros.tipo=="multiple" && (TelefonoValido==1 || celularValido==1))||
                    !parametros.tipo && TelefonoValido==1){
                        
                         return true;
                     }else{
                         return false;
                     }
            }else{
                return true;
            }
        },
        /**
         * verifica la igualdad entre dos campos 
         */
        igualdad:function($campo,validacion,parametros){
            campo = $("#"+parametros.campo);
            if($campo.val()==campo.val())
                return true;
            else
                return false;
        },
        /*------------------------------------------------------**/
        contrasenia:function($campo,validacion,parametros){
            
            var expresionMin = jValidador.validaciones['minuscula'].expr;
            var expresionMay = jValidador.validaciones['mayuscula'].expr;
            var expresionNum = jValidador.validaciones['numero'].expr;
            var expresionCaractEsp = jValidador.validaciones['caracteresEsp'].expr;        
            var valorCampo =  $campo.val();
    
            if(valorCampo!=""){
            
                var minuscula = (expresionMin.test(valorCampo))?1:0;
                var mayuscula = (expresionMay.test(valorCampo))?1:0;
                var numero = (expresionNum.test(valorCampo))?1:0;
                var caracterEsp = (expresionCaractEsp.test(valorCampo))?1:0;
                
                if( minuscula==1 && mayuscula==1 && numero==1 && caracterEsp==1 && valorCampo.length >= 8){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        },
        obtErrores:function(){
            return jv.errores;
        }
    };
    
    jValidador.validaciones = {
          obligatorio:{mensaje:"El campo no puede estar vacio"},
          //email:{   expr:/^[_a-zA-Z0-9-]+(.[_a-z0-9-]+)*@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*(.[a-zA-Z]{2,3})$/, mensaje:"El campo debe ser un mail"},
          email:{   expr:/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,3})$/, mensaje:"El campo debe ser un mail"},
          numerico:{expr:/^\d+$/,mensaje:"El campo debe ser numerico"},
          moneda : {expr:/^\d+$/,mensaje:"El campo debe ser numerico"},
          decimal:{ expr:/^([0-9])*[.|,]?[0-9]*$/,mensaje :"El campo debe ser numerico con decimales"},
          caracteres:{expr: /^[A-ZñÑa-záéíóúÁÉÍÓÚ ]*$/,mensaje:'El campo solo puede contener caracteres'},
          celular:{expr:/^0(412|416|414|424|426)\d{7}$/,mensaje:"El formato del celular no es valido"},
          telefono:{expr:/^02[0-9]{9,13}$/,mensaje:"El formato del telefono no es valido"},
          caracteresEspeciales:{expr:/^([^(*=;\\)])*$/,mensajes:"Caracteres invalidos en el campo"},      
          tiny:{mensaje:"El campo es obligatorio"},
          alfanumerico:{expr:/^[\dA-ZñÑa-záéíóúÁÉÍÓÚ.,\' ]*$/,mensaje:"El campo solo puede contener letras y numeros"},
          documentacion:{expr:/^([V|E|G|J|P|N]{1}\d{8,10})*$/,mensaje:"El campo debe tener el siguiente formato J-18935170"},
          programa:{expr:/^[\d\/\.A-Za-z_-]*$/,mensaje:"El campo solo puede contener letras, guion y underscore"},
          minuscula:{expr:/[a-z]/,mensaje:"La contraseña debe tener al menos una minuscula"},
          mayuscula:{expr:/[A-Z]/,mensaje:"La contraseña debe tener al menos una mayuscula"},
          numero:{expr:/[0-9]/,mensaje:"La contraseña debe tener al menos un número"},
          caracteresEsp:{expr:/(\||\!|\"|\#|\$|\%|\&|\/|\(|\)|\=|\'|\?|\<|\>|\,|\;|\.|\:|\-|\_|\*|\~|\^|\{|\}|\+)/,mensaje:"La contraseña debe tener al menos un caracter especial"},
          coordenada:{expr:/^\-?[0-9]{2}\.[0-9]{3,15}/,mensaje:"La coordenada debe tener el siguiente formato:"},
          internacional:{expr:/^\d{9,18}$/,mensaje:"El telefono internacional no es valido"}
            
    }; 
    /**
     *   =============================
     *   DECLARACION DEL PLUGIN 
     *  ============================
     * 
     */
    function jPlugin(config,e){
        
        var $this = $(this);
        return this.each(function(k,v){
            $(this).on('click',function(e){
                v = new jValidador(this,config,e);
                
                
            });
            
        });
    };
    /**
     *Inicialización via js 
     */
    $.fn.jValidador = jPlugin;
    //Inicialización via data
    $( document ).on('click',jdValidador,function(e){
        
        if($(this).data('config')!=undefined){
          var  data = $(this).data('config');
        }else{
          var  data = new Object();
        }
        data.viaData=true;
        new jValidador(this,data,e);
    });    
})(jQuery);