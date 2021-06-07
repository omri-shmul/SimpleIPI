
/****************************************************************************
 * Firebase Init                                                            *
 * **************************************************************************/
var firebaseConfig = {
    apiKey: "AIzaSyDUsA1lsCvBInCyKDZsYVPhF26OOPeqSDk",
    authDomain: "simpleipi.firebaseapp.com",
    databaseURL: "https://simpleipi-default-rtdb.firebaseio.com",
    projectId: "simpleipi",
    storageBucket: "simpleipi.appspot.com",
    messagingSenderId: "521836219458",
    appId: "1:521836219458:web:36494bed0ab8253963f1db"
  };
  
firebase.initializeApp(firebaseConfig);

let newItems = false;

/****************************************************************************
 * Draw on Radar once intruder detected                                     *
 * **************************************************************************/

 var canvas = document.getElementById("canvas");
 const ctx = canvas.getContext("2d");
 
 canvas.width = 351;
 canvas.height = 351;
 
 var radius = 2;

function drawIntruder(range,azimuth) {
  
  var x = 175 + (range * Math.cos(azimuth));
  var y = 175 - (range * Math.sin(azimuth));

  ctx.beginPath();
  ctx.arc(x, y, radius,0,2 *Math.PI, false);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.stroke();
}

/****************************************************************************
 * Listen to Firebase using "on" function                                   *
 * **************************************************************************/
 
var database = firebase.database();
let ref = database.ref('message_list').limitToLast(1).on('value', (function(snapshot){
  snapshot.forEach(function(child) {
    if (!newItems) { return }
      var childData = child.val();
      var azimuth=child.val().Azimuth;
      var range=child.val().Range;
     
      document.getElementById('textBox').value += "Azimuth: " + azimuth + " Range: " + range + '\n';
        
      newItems = false;
      drawIntruder(range, azimuth);
        
    });
    
    ref = database.ref('message_list').once('value', () => {
      newItems = true;
    })
}));

/****************************************************************************
 * Retrive Geo Coordinates from Firebase and embed coordinats in Bing Maps  *
 * **************************************************************************/

var tempLon, tempLat;

ref = database.ref('geo').on('value', (function(snapshot){
    
  snapshot.forEach(function(child) {
    var Lon = child.val().lon;
    var Lat = child.val().lat;
    
     if (Lon != tempLon && Lat != tempLat)
     {
       tempLon = Lon;
       tempLat = Lat;

       document.getElementById('mapWeb').setAttribute("src",
                   "https://www.bing.com/maps/embed?h=340&w=340&cp=" +
                    Lat + "~" + Lon + "&lvl=18&typ=d&sty=a&src=SHELL&FORM=MBEDV8");
     }          
      
      });
}))





