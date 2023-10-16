//get the data 

// get past 7 day from website
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

const RADIUS_SCALE = 9;
const RADIUS_MIN = 5;
const COLOR_COLORS = ["#ffd538","#ff8200","#0c5d99","#d55fff#","#008080","#c60000"]
const COLOR_DEPTHS = [1,2,3,25,39,99]

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });


  function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
       layer.bindPopup("Magnitude:"+feature.properties.mag+"<br>Depth:"+ feature.geometry.coordinates[2]+",<br>Location: "+feature.properties.place+"<br>");
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.

   
    function getColor(depth) { 
      if ( depth <= COLOR_DEPTHS[0]) {
          return COLOR_COLORS[0];
      
	  } else if (depth >= COLOR_DEPTHS[1]) {
        return COLOR_COLORS[1];
       
	  }	else if (depth >= COLOR_DEPTHS[2]) {
        return COLOR_COLORS[2];
        
      } else if (depth >= COLOR_DEPTHS[3]) {
        return COLOR_COLORS[3];	 
		
      } else if (depth >= COLOR_DEPTHS[4]) {
        return COLOR_COLORS[4];
		
	  }else {
        return COLOR_COLORS[1];
      }
    
    }
    
    function getRadius(magitute) { 
      return Math.max(magitute * RADIUS_SCALE, RADIUS_MIN);
    }
    
    
    function pointToLayer(feature, latlng) {
      console.log(feature)
      let depth = feature["geometry"]["coordinates"][2];
      let mag = feature["properties"]["mag"];
      let circleMarkerOptions = {
        radius: getRadius(mag),
        color: "black",
        fillColor: getColor(depth)
      }
      return L.circleMarker(latlng, circleMarkerOptions)
    }
    
    

    let earthquakeOptions =  {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer
    };

    let earthquakes = L.geoJSON(earthquakeData, earthquakeOptions);
    
    
    


  // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
    }

    function createMap(earthquakes) {

        // Create the base layers.
        let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      
        let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });
      
        // Create a baseMaps object.
        let baseMaps = {
          "Street Map": street,
          "Topographic Map": topo
        };
       // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
///paste it here////////////

  // // Set up the legend.
  var legend = L.control({position: 'bottomright'})
  
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = COLOR_DEPTHS
    var colors = COLOR_COLORS
    var labels = []
    
 // Add the minimum and maximum.
 let legendInfo = "<h1>Earthquakes <br />(Magnitute)</h1>" +
 "<div class=\"labels\">" +
   "<div class=\"min\">" + limits[0] + "</div>" +
   "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
 "</div>";

div.innerHTML = legendInfo;

limits.forEach(function(limit, index) {
 labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
});

div.innerHTML += "<ul>" + labels.join("") + "</ul>";
return div;
};

// Adding the legend to the map
legend.addTo(myMap); 
  



} 

