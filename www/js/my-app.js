

var app = new Framework7({
  // elemento raiz
  root: '#app',
  ///nombre app
  name: 'SignIn',
  //id de app
  id: 'es.lesytec',
  material: true,
  
  picker: {
    rotateEffect: false,
    openIn: 'popover',
  },
  // rutas por defecto
  routes: [
  {
    path: '/condiciones/',
    url: 'condiciones.html',
  },
  {
    path: '/reglas/',
    url: 'reglas.html',
  }
  ],

});



var mainView = app.views.create('.view-main');
var $$=Dom7;

  // seteamos la fecha actual en el  formulario.
 $('#fecha').val(fechaActual());

// captura datos formulario

/*$$('.convert-form-to-data').on('click', function(){
  var formData = app.form.convertToData('#formulario');
  alert(JSON.stringify(formData));
});*/

//CAPTURAR FIRMA -------------------------------------------------
//incializar el pad
$("#signature").jSignature({'height':290, 'width':270});

//Evento generado por el boton limpiar, borra el canvas.
$("#clear").click (function(){
     $("#signature").jSignature("clear");
});


//Evento al pulsar el boto enviar, captura por una parte los datos de login, la firma y el formulario.
  $("#captura").click (function(){

     // capturamos la firma en un hidden                               
     $('#firma').val($("#signature").jSignature("getData", "base30"));

    var capturaFirma = $("#signature").jSignature("getData", "base30");
 		
     if (capturaFirma[1]===""){

        app.dialog.alert("Firma vacia", "Formulario incompleto");
       return;
     }//else{//  Anulamos para hacer la prueba de validacion del form por jquery. ojo a la llave de cierre si hay que voler

     if (!($("#formulario")[0].checkValidity())){
       app.dialog.alert("Campos incorrectos", "Formulario incompleto");
      return;
     }

     if (!$('#condiciones').is(':checked'))
     {
      app.dialog.alert("Las Condiciones tienen que ser aceptadas", "Formulario incompleto");
      return;
      }

    if (!$('#prl').is(':checked'))
     {
      app.dialog.alert("Las reglas que salvan tienen que ser aceptadas", "Formulario incompleto");
      return;
      }


      var formData = app.form.convertToData('#formulario');
      alert(JSON.stringify(formData));

     //act_bbdd (formData); // para firebase----------------------
    
     

  });

  //--- LOGIN --------------------------------------------------------
  // por ajax enviamos el formulario para que nos de la configuracion.
  //------------------------------------------------------------------/-

  $("#recupera").click (function(){
      var exp =  $("#explotacion").val();
      var pwd =  $("#password").val();
      // comprobar que no estan vacios.
      if (exp == "" || pwd =="" ){
        alert ("rellene los campos explotacion y password");
        return;
      }
      $.ajax ({
                data: {
                  "explotacion" : exp,
                  "password" : pwd
                },
                url: 'http://192.168.1.7/proyectoSignin/web/conf.php',
                type: 'get',
                beforeSend: function () { $("#peticion").html('Procesando ...'); app.dialog.preloader();},
                success: function (response) {
                    setTimeout(function () {
                          app.dialog.close();
                          }, 300);
                   var obj = JSON.parse(response)
                   if (obj.msg != 'ok'){
                         $("#peticion").html('-- Fallo en los credenciales -- ');
                         return;
                    }

                  $("#peticion").html(response);

                  //llenar el select dinamicamente.
                  var cnt = obj.instalacion.length;
                  var cad = "";
                  for (var i = 0; i < cnt; i++) {
                    cad = "<option value = '" + obj.instalacion[i][0] + "'>"+ obj.instalacion[i][1] + "</option>";
                    $("#peticion").append(cad);
                    $("#instalacion").append(cad);

                  }
                  //vamos a intentar llenar el select dinamicamente.
                  var cnt = obj.operario.length;
                  var cad = "";
                  for (var i = 0; i < cnt; i++) {
                    cad = "<option value = '" + obj.operario[i][0] + "'>"+ obj.operario[i][1] + "</option>";
                    $("#peticion").append(cad);
                    $("#operario2").append(cad);

                  }


                }
      })
    });



/**--------------------------------------
* fechaActual -- recoje la hora actual para poder asignarla a un campo
*/
function fechaActual ()
{
 var dt = new Date();

  if ((dt.getMonth()+1) <10){

   var month = "0" + (dt.getMonth()+1);
 }else {
   var month = dt.getMonth()+1;
 }
 if (dt.getDate() < 10){
   var day = "0"+ dt.getDate();

 }else {
   var day = dt.getDate();
 }


 var year = dt.getFullYear();
 fecha= (year + '-' + month + '-' + day);
 console.log (fecha);


 return fecha;
 //devuelve actual mes, dia, año
	
}

  /**----------------------------------------------------------------
  * funcion para usar la bbdd de firebase (anulada para el proyecto)
  */
  function act_bbdd (data) {
    // logeamos el usuario.
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword('prueba@prueba.es', 'prueba');
    promise.catch (e=> console.log(e.message));
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser){
        console.log('logueado');
        var db = firebase.firestore();
        const settings = {/* your settings... */ 

        timestampsInSnapshots: true};
        db.settings(settings);
        db.collection("registro").add(data)
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          alert("Document written with ID: ", docRef.id);
          $$('#formulario')[0].reset();
          $("#signature").jSignature("clear");
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
          alert("Error adding document: ", error);
        });


      }else{
        console.log ('no logueado');
      }
    })

  }

  // ----------------------------------------------------
  function limpiaForm (){

  }

  