
// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map with a default view
    var map = L.map('map').setView([40, 0], 5);
  
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors: Nikhil Kurane'
    }).addTo(map);
  
    
    let markerCoords = mapMarker;
  
  
    if (typeof markerCoords === "string") {
      try {
        markerCoords = JSON.parse(markerCoords);
      } catch (e) {
        console.error("Failed to parse mapMarker:", mapMarker);
      }
    }
  
    
    if (Array.isArray(markerCoords) && markerCoords.length === 2) {
      // Destructure the array: markerCoords = [lng, lat]
      let [lng, lat] = markerCoords;
      // Check that both lat and lng are valid numbers
      if (!isNaN(lat) && !isNaN(lng)) {
        // Place the marker on the map with swapped coordinates
        L.marker([lat, lng]).addTo(map)
          .bindPopup('Listing Location')
          .openPopup();
  
        // Center the map view on the marker with a zoom level of 13
        map.setView([lat, lng], 13);
      } else {
        console.error("Invalid numeric coordinates:", markerCoords);
      }
    } else {
      console.error("Map marker data is missing or invalid:", markerCoords);
    }
  
    if (typeof GeoSearch !== "undefined") {
      // Create an OpenCage provider with your API key
      const provider = new GeoSearch.OpenCageProvider({
        params: { key: mapToken }
      });
  
      // Create the GeoSearch control
      const searchControl = new GeoSearch.GeoSearchControl({
        provider: provider,
        style: 'button',  // You can change to 'bar' if desired
        autoClose: true,
        retainZoomLevel: false
      });
  
      // Add the GeoSearch control to the map
      map.addControl(searchControl);
    } else {
      console.error("GeoSearch is not defined. Please include leaflet-geosearch.");
    }
  });
  