var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    
function colorGradient(d) {
 return d > 5? '#c05555' :
       d > 4? '#d89660 ' :
       d > 3  ? '#f6ce82' :
       d > 2  ? '#f5e270' :
       d > 1   ? '#edf794' :
                  '#dbf9a6 ';
}
   
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }


function style(feature) {
  var mag = feature.properties.mag; 
  var color_value=colorGradient(mag)

  return {radius: feature.properties.mag*4,
    color: "#000",
    fillColor:color_value,
    fillOpacity: 0.65,
    weight: 1,
    opacity: 0}
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

  pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, style(feature));
    },

  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

      
var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
  maxZoom: 18,
  subdomains:['mt0','mt1','mt2','mt3']
});
  
  
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  }); 
    
    
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Dark Map": darkmap,
    "satellite":satellite, 
    "Street Map": streetmap
  };
                                
                                  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
  };
                                
      // Create our map, makes dark map the default
  var myMap = L.map("map", {
    center: [
      37.09, -60.71
    ],
    zoom: 2.5,
    layers: [darkmap, earthquakes]
  });                        
               
      L.control.layers(baseMaps, overlayMaps).addTo(myMap);
                                 
    } 
