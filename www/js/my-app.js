
var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'SignIn',
  // App id
  id: 'es.lesytec',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  picker: {
    rotateEffect: false,
    openIn: 'popover',
  },
  // Add default routes
  routes: [
  {
    path: '/about/',
    url: 'about.html',
  },
  ],

  // ... other parameters
});



var mainView = app.views.create('.view-main');
var $$=Dom7;

var pickerDevice = app.picker.create({
  input: '#demo-picker-device',
  cols: [
  {
    textAlign: 'center',
      // values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
      values: ['apple', 'orange', 'bananna'],
      displayValues: ['Apple', 'Orange', 'Bananna'],
    }
    ]
  });
$('#fecha').val(fechaActual());
// captura datos formulario

/*$$('.convert-form-to-data').on('click', function(){
  var formData = app.form.convertToData('#formulario');
  alert(JSON.stringify(formData));
});*/
//incializar el pad
$("#signature").jSignature({'height':290, 'width':270});
$("#clear").click (function(){
                                
  $("#signature").jSignature("clear");
});
  //capturar en una variable la firma.
  $("#captura").click (function(){
     // capturamos la firma en un hidden                               
     $('#firma').val($("#signature").jSignature("getData", "base30"));

    var capturaFirma = $("#signature").jSignature("getData", "base30");
 		//alert(JSON.stringify(formData));
     if (capturaFirma[1]===""){

       alert (" Firma vacia.");
       return;
     }else{
      var formData = app.form.convertToData('#formulario');
      act_bbdd (formData);
    }
  });


//--------------------------------------
function fechaActual ()
{
 var dt = new Date();

	// Display the month, day, and year. getMonth() returns a 0-based number.

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

	// Output: current month, day, year
}

  //-----------------------------------------

  function act_bbdd (data) {
    // logeamos el usuario.
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword('prueba@prueba.es', 'prueba');
    promise.catch (e=> console.log(e.message));
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser){
        console.log('logueado');
        var db = firebase.firestore();
        const settings = {/* your settings... */ timestampsInSnapshots: true};
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