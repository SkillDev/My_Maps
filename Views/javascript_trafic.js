/*jslint browser: true*/
/*global $, jQuery*/
/*global google, jQuery*/
/*global autocomplet, jQuery*/
var mapOptions;
var carte;
var trafficLayer;
var waypoint = [];
var panel;
var depart;
var arriver;
var direction;
var position;
var trace;
var request;
var autocomplete;

//__________________map_____________________________& ______marker _______________________________
function initialize() {
    "use strict";
    mapOptions = {center : { lat: 48.8534100, lng: 2.3488000}, zoom : 12};

    carte = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(carte);
    panel = document.getElementById('info');
}
//___________________________itineraire_______________________________
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

    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(carte);
    depart = document.getElementById('depart').value;
    arriver = document.getElementById('destination').value;
    trace = new google.maps.DirectionsService();
    direction = new google.maps.DirectionsRenderer({'map' : carte});
    request = {origin : depart, destination : arriver, travelMode : google.maps.DirectionsTravelMode.DRIVING,  waypoints : waypoint, optimizeWaypoints : true, durationInTraffic : true, provideRouteAlternatives : true, unitSystem : google.maps.DirectionsUnitSystem.METRIC};

    trace.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            direction.setDirections(response);
            direction.setMap(carte);
            direction.setPanel(panel);
            panel.innerHTML = "";
            direction.suppressMarkers = false;
            direction.setOptions({
                polylineOptions : {strokeColor :  'blue'},
                preserveViewPort : true,
                draggable : true
            });
        }

    });

    e.preventDefault();
}

document.getElementById("sub").addEventListener('click', itineraire);
//__________________________________________localisation___________________________

function localisation(e) {
    "use strict";
    if (navigator.geolocation) {
        position = function (position) {
            var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude), myOptions = {zoom : 13, center : point, mapTypeId : google.maps.MapTypeId.ROADMAP}, carte = document.getElementById("map-canvas"), map = new google.maps.Map(carte, myOptions), marker = new google.maps.Marker({position : point, map : map, title : "Je suis ici", draggable : true});
            depart.value = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            trafficLayer.setMap(map);
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

//___________________________autocomplete____________________________



var depart = document.getElementById('depart');
var destination = document.getElementById('destination');

var options = {
    types: ['geocode']
};

autocomplete = new google.maps.places.Autocomplete(depart, options);
autocomplete = new google.maps.places.Autocomplete(destination, options);

//________________charge after load of html_______________________
google.maps.event.addDomListener(window, 'load', initialize);


//_________recherche____________________
