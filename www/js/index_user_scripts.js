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

        //outdated code to be removed
        //get the current position of the user
        intel.xdk.geolocation.getCurrentPosition(onSuccess, onError);
       // var geoLocation =   intel.xdk.geolocation.getCurrentPosition();
        //alert("test");
        
        //select the navigation page map
        var myMap = googleMaps.getObjectBySelector('#mapA');
        myMap.setZoom(17);
      
        var circleArray = [];
        var i;
       
        if(!pointsLoaded)
        {
        for(i=0; i<10; i++)
        {
           var tempLocation = new google.maps.LatLng(defaultTourPoints[i][0], defaultTourPoints[i][1]); 
            if(i == nextTourPoint)
            {
                 var tempMarker =  new google.maps.Marker({position: tempLocation, map: myMap, icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"});  
            }else
            {
           var tempMarker =  new google.maps.Marker({position: tempLocation, map: myMap});  
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
        }
        
       // markerArray[4].setMap(null);
        
        //alert(defaultTourPoints[1][1] );
       
        var result =  myMap.getCenter().toString();
        var myLocation = new google.maps.LatLng(defaultTourPoints[0][0], defaultTourPoints[0][1] );
        var userLatLng = new google.maps.LatLng(userLat, userLng );
        var homeLocation = new google.maps.LatLng(defaultTourPoints[nextTourPoint][0], defaultTourPoints[nextTourPoint][1] );
        var distance = getDistance(userLatLng, homeLocation);
        var markerAdded =  new google.maps.Marker({position: myLocation, map: myMap});
       
       
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
     
    var marker = new google.maps.Marker({
      position: myLocation,
      map: myMap,
      title: 'Hello World!'
  });
       // var isVisible = markerAdded.getVisible();
         
   
    });
     
       $(document).on("click", ".uib_w_41", function(evt)
    {
     alert("Distance between phone gps and blue dot: " + distance  + " meters"); 

  });
    
     
   
  
    }
    
   
  
    
      
 document.addEventListener("app.Ready", register_event_handlers, false);
})();

//var watchTimer = intel.xdk.geolocation.watchPosition(successFunction,errorFunction,options);

//Function used to update the current location
var onSuccess = function(position) {
   /* alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' 
          );
        */
    
    /*
        var myMap = googleMaps.getObjectBySelector('#mapA');
        var oldMarker = userMarker;
        var userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude );
        userMarker =  new google.maps.Marker({position: userLocation, map: myMap, draggable: true, opacity:.9, icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png'});  
        userLat = position.coords.latitude;
        userLng = position.coords.longitude ;
       
    if(oldMarker != null)
    {
    oldMarker.setMap(null);
    }
    
   
    
    */
       
         //alert("updated Map info"); 
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

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
]

var nextTourPoint = 0;


//Use these functions to calculate the distance between two points on the map

var rad = function(x) {
  return x * Math.PI / 180;
};

var userLat =0;
var userLng = 0;
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

//This array holds the options for the command
var options = {timeout: 100, maximumAge: 11000, enableHighAccuracy: true };

//This function is called on every iteration of the watch Position command that fails
var fail = function(){
  alert("Geolocation failed. \nPlease enable GPS in Settings.");
};

//This function is called on every iteration of the watchPosition command that is a success
var suc = function(p){
  //alert("Moved To: Latitude:" + p.coords.latitude + "Longitude:" + p.coords.longitude);
    var oldLat = watchLat;
    var oldLng = watchLng;
    var myMap = googleMaps.getObjectBySelector('#mapA');
    
    watchLat = p.coords.latitude;
    watchLng = p.coords.longitude;
    
        var userLatLng = new google.maps.LatLng(watchLat, watchLng );
        var homeLocation = new google.maps.LatLng(defaultTourPoints[nextTourPoint][0], defaultTourPoints[nextTourPoint][1] );
        distance = getDistance(userLatLng, homeLocation);
    
        //reached destination
        if(distance<10 && nextTourPoint<10)
        {
            //remove waypoint
         markerArray[nextTourPoint].setMap(null);
         
        //go to next point    
         nextTourPoint++;
            
        //this is to change the color of the point    
            markerArray[nextTourPoint].setMap(null);  
            var tempLocation = new google.maps.LatLng(defaultTourPoints[nextTourPoint][0], defaultTourPoints[nextTourPoint][1]);  
            var tempMarker =  new google.maps.Marker({position: tempLocation, map: myMap, icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"});  
            markerArray[nextTourPoint] = tempMarker;
            
            
        }
   
    if(oldLat != watchLat || oldLng != watchLng || !startedTracking)
    {
        startedTracking  = true;
        
        var oldWatch = watchMarker;
        var watchLocation = new google.maps.LatLng(watchLat, watchLng );
        watchMarker =  new google.maps.Marker({position: watchLocation, map: myMap, draggable: true, opacity:.9, icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'});  
        if (oldWatch != null)
        {
         oldWatch.setMap(null);   
        }
        myMap.setCenter(watchLocation);
    }

};

//This command starts watching the geolocation
var geolocationWatchTimer = intel.xdk.geolocation.watchPosition(suc,fail,options);

//Call the stopGeolocation function to stop the geolocation watch
var stopGeolocation = function(){
        intel.xdk.geolocation.clearWatch(geolocationWatchTimer);
}
     
var watchLat;
var watchLng;
var watchMarker;
var debugCounter = 1;
var startedTracking = false;

/*
raw data for location


1
lat:33.419844   long:-111.931772
2
lat:33.419844   long:-111.931772
3
lat:33.419777   long:-111.932591
4
lat:33.419993   long:-111.932625
5
lat:33.420230   long:-111.932637
6
lat:33.420283   long:-111.932112
7
lat: 33.420219  long:-111.931381
8
lat:33.419265   long:-111.931098
9
lat:33.418849   long:-111.931342
10
lat:33.418448   long:-111.931536
11
lat:33.418421  long:-111.932311

*/



