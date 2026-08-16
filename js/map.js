document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('leaflet-map');
    if (!mapElement) return;

    // Initialize map centered on South/Central India
    const map = L.map('leaflet-map', {
        scrollWheelZoom: false // Prevent accidental scrolling when scrolling down the page
    }).setView([17.3850, 78.4867], 6);

    // Add Voyager map layer (clean road map style similar to Google Maps)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Enable scroll zoom only after clicking on the map
    map.on('focus', () => { map.scrollWheelZoom.enable(); });
    map.on('blur', () => { map.scrollWheelZoom.disable(); });

    // Fetch and render states GeoJSON with distinct colors
    fetch('assets/states.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: function(feature) {
                    const stateName = feature.properties.ST_NM || '';
                    let hash = 0;
                    for (let i = 0; i < stateName.length; i++) {
                        hash = stateName.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    const hue = Math.abs(hash % 360);
                    return {
                        fillColor: `hsl(${hue}, 65%, 70%)`,
                        weight: 1.5,
                        opacity: 1,
                        color: '#ffffff', // White state borders
                        fillOpacity: 0.45 // Semi-transparent overlay
                    };
                }
            }).addTo(map);
        })
        .catch(err => console.error('Error loading states GeoJSON:', err));

    // Note: Leaflet uses [Latitude, Longitude]
    const cities = {
        Hyderabad: [17.3850, 78.4867],
        Goa: [15.2993, 74.1240],
        Hampi: [15.3350, 76.4600],
        Araku: [18.3333, 82.8790],
        Chirala: [15.8167, 80.3547],
        Warangal: [17.9689, 79.5941],
        Pondicherry: [11.9416, 79.8083],
        Gandikota: [14.8145, 78.2842],
        Vizag: [17.6868, 83.2185],
        Srisailam: [16.0730, 78.8711],
        Coorg: [12.3375, 75.7392],
        Mysore: [12.2958, 76.6394],
        Ooty: [11.4100, 76.6932],
        Munnar: [10.0889, 77.0595],
        Gokarna: [14.5422, 74.3188],
        Dandeli: [15.2415, 74.6190],
        Chikmagalur: [13.3161, 75.7725],
        Horsley: [13.6508, 78.3980],
        Lambasingi: [17.8167, 82.4900],
        Ananthagiri: [17.3101, 77.8548],
        Belum: [15.1027, 78.1118],
        Lepakshi: [13.8037, 77.6080],
        Nagarjuna: [16.5770, 79.3134],
        Kodaikanal: [10.2381, 77.4892],
        Alleppey: [9.4981, 76.3388],
        Mahabalipuram: [12.6269, 80.1937],
        Dudhsagar: [15.3144, 74.3143],
        Mantralayam: [15.9427, 77.4326],
        Ahobilam: [15.1326, 78.7183],
        Ethipothala: [16.5500, 79.3167],
        Kudremukh: [13.2500, 75.2750],
        Tadoba: [20.2444, 79.3243],
        Pench: [21.6577, 79.2483],
        Kuntala: [19.3000, 78.4833],
        Ajanta: [19.8762, 75.3182],
        Nanded: [19.1492, 77.3090],
        Varanasi: [25.3176, 83.0039],
        Prayagraj: [25.4358, 81.8463],
        Ayodhya: [26.7922, 82.1998]
    };

    const hydCoords = cities.Hyderabad;

    // Draw Hyderabad marker
    L.circleMarker(hydCoords, {
        color: '#ff2d55',
        fillColor: '#ff2d55',
        fillOpacity: 1,
        radius: 8,
        weight: 2
    }).addTo(map).bindPopup('<b>Hyderabad</b> (Departure Hub)');

    // Draw destination lines and markers
    for (const [city, coords] of Object.entries(cities)) {
        if (city === 'Hyderabad') continue;

        // Draw dotted line
        L.polyline([hydCoords, coords], {
            color: '#ff2d55',
            weight: 2,
            dashArray: '5, 5',
            opacity: 0.4
        }).addTo(map);

        // Draw city marker
        L.circleMarker(coords, {
            color: '#00b8d4',
            fillColor: '#ffffff',
            fillOpacity: 1,
            radius: 6,
            weight: 3
        }).addTo(map).bindPopup(`<b>${city}</b><br>Weekend Trip Destination`);
    }
});
