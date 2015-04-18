(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
     
     /* button  Test_button */
    $(document).on("click", ".uib_w_40", function(evt)
    {
        //this tracks the users current position
        var geolocationWatchTimer = intel.xdk.geolocation.watchPosition(suc,fail,options);
      
        //get a reference to the application map
        var myMap = googleMaps.getObjectBySelector('#mapA');
        myMap.setZoom(17);
       
        if(!pointsLoaded)
        {
        loadAllTourPoints(myMap);
        }
        
      
       
        var result =  myMap.getCenter().toString();
        var myLocation = new google.maps.LatLng(defaultTourPoints[0][0], defaultTourPoints[0][1] );
        var userLatLng = new google.maps.LatLng(userLat, userLng );
        var homeLocation = new google.maps.LatLng(defaultTourPoints[nextTourPoint][0], defaultTourPoints[nextTourPoint][1] );
        var distance = getDistance(userLatLng, homeLocation);
        var markerAdded =  new google.maps.Marker({position: myLocation, map: myMap});
       
       /*
        var circle_Options = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: myMap,
            center: myLocation,
            radius: 10  
        };
        
        firstCircle = new google.maps.Circle(circle_Options);
        */
        
        /*
     
    var marker = new google.maps.Marker({
      position: myLocation,
      map: myMap,
      title: 'Hello World!'
  });
       */
         
   
    });
           
     
//This function is an event listener for the load tour points button. It will be removed from the prototype     
     
       $(document).on("click", ".uib_w_41", function(evt)
    {
           if(currentLocationMarker === null)
           {
               alert("does not exist");
           }else
           {
               var info = + currentLocationMarker.getPosition().lng();
     alert("GPS COORDS !"+ info  ); 
           }
  });
     
     
     
    }   
      
 document.addEventListener("app.Ready", register_event_handlers, false);
})();



var loadAllTourPoints = function(myMap)
{
      var circleArray = [];
        var i;
    var tempMarker;
    
    for(i=0; i<10; i++)
        {
           var tempLocation = new google.maps.LatLng(defaultTourPoints[i][0], defaultTourPoints[i][1]); 
            if(i == nextTourPoint)
            {
                  tempMarker =  new google.maps.Marker({position: tempLocation, map: myMap, icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"});  
            }else
            {
            tempMarker =  new google.maps.Marker({position: tempLocation, map: myMap});  
            }
            markerArray[i] = tempMarker;
            var temp_Options = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: myMap,
            center: tempLocation,
            radius: 10 
        };
         
            circleArray[i] = temp_Options;
        var tempCircle = new google.maps.Circle(temp_Options);
               
            
        }
            pointsLoaded = true;

};

var currentLocationLat;
var currentLocationLng;
var currentLocationMarker;
var debugCounter = 1;
var startedTracking = false;

var nextTourPoint = 0;
var userLat =0;
var userLng = 0;
var distance;
var userMarker;
var markerArray = [];
var pointsLoaded = false;






//maps the default tour
var defaultTourPoints = [
   
    [33.419844,-111.931772], 
    [33.419777,-111.932591], 
    [33.419993,-111.932625], 
    [33.420230 ,-111.932637], 
    [33.420283,-111.932112], 
    [33.420219,-111.931381], 
    [33.419265,-111.931098], 
    [33.418849,-111.931342], 
    [33.418448 ,-111.931536], 
    [33.418421,-111.932311], 
];




//This array holds the options for the command
var options = {timeout: 100, maximumAge: 11000, enableHighAccuracy: true };

//This function is called on every iteration of the watch Position command that fails
var fail = function(){
  alert("Geolocation failed. \nPlease enable GPS in Settings.");
};

//This function is called on every iteration of the watchPosition command that is a success
var suc = function(p){
    //Grab a reference to the map
    var myMap = googleMaps.getObjectBySelector('#mapA');
    
  //The first thing to do within this function is to move the marker on the map to the new location
  //of the gps coordinates of the phone
    
    //save old values
    var oldLat = currentLocationLat;
    var oldLng = currentLocationLng;
   
    //get the new values
    currentLocationLat = p.coords.latitude;
    currentLocationLng = p.coords.longitude;
     
    //Prepare to compare the distances between the user and the current tour point.
    var currentLatLng = new google.maps.LatLng(currentLocationLat, currentLocationLng);
    var currentTourPoint = new google.maps.LatLng(defaultTourPoints[nextTourPoint][0], defaultTourPoints[nextTourPoint][1]);
    
    //call this function to make changes to the tour point state based on distance
    updateCurrentTourPoint(currentLatLng, currentTourPoint, myMap);
     
    
    
     var watchLocation = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
   // myMap.setCenter(watchLocation);
     //this block of code is to move the current gps location marker to it's new location
  
           
        var oldWatch = currentLocationMarker;
      
       // var watchLocation = new google.maps.LatLng(currentLocationLat, currentLocationLng );
    
    if(oldLat != currentLocationLat || oldLng != currentLocationLng || !startedTracking)
    {
        startedTracking = true;
       currentLocationMarker =  new google.maps.Marker({position:new google.maps.LatLng(p.coords.latitude, p.coords.longitude), map: myMap, draggable: false, opacity:0.9, icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'}); 
          
    
        if (oldWatch !== null)
        {
         oldWatch.setMap(null); 
        }
        myMap.setCenter(currentLocationMarker.getPosition());
        
    }
    
};



var updateCurrentTourPoint = function(currentLatLng, currentTourPoint, myMap)
{
     //calculate the distance between points
    distance = getDistance(currentLatLng, currentTourPoint);
    
    //true == reached destination
    if(distance<10 && nextTourPoint<10)
    {
        //remove waypoint
        markerArray[nextTourPoint].setMap(null);
         
        //go to next point    
        nextTourPoint++;
            
        //this is to change the color of the point new destination point  
        markerArray[nextTourPoint].setMap(null);  
        var tempLocation = new google.maps.LatLng(defaultTourPoints[nextTourPoint][0], defaultTourPoints[nextTourPoint][1]);  
        var tempMarker =  new google.maps.Marker({position: tempLocation, map: myMap, icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"});  
        markerArray[nextTourPoint] = tempMarker;             
    }
      
};

var geolocationWatchTimer = intel.xdk.geolocation.watchPosition(suc,fail,options);

//Call the stopGeolocation function to stop the geolocation watch
var stopGeolocation = function(){
        intel.xdk.geolocation.clearWatch(geolocationWatchTimer);
};
     



//Use these functions to calculate the distance between two points on the map
var rad = function(x) {
  return x * Math.PI / 180;
};


var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};


