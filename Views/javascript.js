/*jslint browser: true*/
var google;
var autocomplete;
var mapOptions;
var carte;
var depart;
var arriver;
var position;
var trace;
var direction = new google.maps.DirectionsRenderer();
var waypoint = [];
var request;
var panel;
//__________________map_____________________________
function initialize() {
    "use strict";
    mapOptions = {
        center : {lat: 48.8534100, lng: 2.3488000},
        zoom : 6
    };
    carte = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    panel = document.getElementById('info');
    //var center = carte.getCenter();
    //var zoom = carte.getZoom();

   // localStorage.mapCenter = JSON.stringify(center);
    //localStorage.mapZoom = zoom;

}

google.maps.event.addDomListener(window, 'load', initialize);

//_____________________________________________itineraire____________________________________________________
function itineraire(e) {
    "use strict";
    carte = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    google.maps.event.addListener(carte, 'click', function (event) {
        var lol = new google.maps.LatLng(event.latLng.k, event.latLng.D);
        waypoint.push({
            location : lol
        });
        itineraire(e);
    });


    depart = document.getElementById('depart').value;
    arriver = document.getElementById('destination').value;
    trace = new google.maps.DirectionsService();
    direction = new google.maps.DirectionsRenderer({'map' : carte});
    request = {origin : depart, waypoints : waypoint, optimizeWaypoints : true, destination : arriver, travelMode : google.maps.DirectionsTravelMode.DRIVING, unitSystem : google.maps.DirectionsUnitSystem.METRIC};

    trace.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            direction.setDirections(response);
            direction.setMap(carte);
            direction.setPanel(panel);
            panel.innerHTML = "";
            direction.suppressMarkers = false;
            direction.setOptions({
                polylineOptions : {strokeColor :  '#ff0000'},
                preserveViewPort : true,
                draggable : true
            });
        }

    });

    e.preventDefault();
}

document.getElementById("sub").addEventListener('click', itineraire);

//______________________________________________localisation____________________________

function localisation(e) {
    "use strict";
    if (navigator.geolocation) {
        position = function (position) {
            var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude), myOptions = {zoom : 13, center : point, mapTypeId : google.maps.MapTypeId.ROADMAP}, carte = document.getElementById("map-canvas"), map = new google.maps.Map(carte, myOptions), Marker = new google.maps.Marker({position : point, map : map, title : "Je suis ici"});
            depart.value = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        };
        navigator.geolocation.getCurrentPosition(position);

    }
    e.preventDefault();
}

document.getElementById("localisation").addEventListener('click', localisation);
//_________________________fullscreen _______________________

function fullscreen(e) {
    "use strict";
    var map_carte = document.getElementById('map-canvas');

    if (map_carte.requestFullscreen) {
        map_carte.requestFullscreen();
    } else if (map_carte.msRequestFullscreen) {
        map_carte.msRequestFullscreen();
    } else if (map_carte.mozRequestFullScreen) {
        map_carte.mozRequestFullScreen();
    } else if (map_carte.webkitRequestFullscreen) {
        map_carte.webkitRequestFullscreen();
    }

    e.preventDefault();
}

document.getElementById("fullscreen").addEventListener('click', fullscreen);

//_______________________autocomplete____________________________


//objet qui n'on pas été crée par des methode 
var depart = document.getElementById('depart');
var destination = document.getElementById('destination');
var options = {types : ['geocode']};

autocomplete = new google.maps.places.Autocomplete(depart, options);
autocomplete = new google.maps.places.Autocomplete(destination, options);