document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('leaflet-map');
    if (!mapElement) return;

    // Initialize map centered on India
    const map = L.map('leaflet-map', {
        scrollWheelZoom: false, // Prevent accidental scrolling when scrolling down the page
        zoomSnap: 0.1,
        zoomDelta: 0.5
    }).setView([22.9074, 79.0881], 4.2);

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
        Bapatla: [15.9048, 80.4688],
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
        Ayodhya: [26.7922, 82.1998],
        Mumbai: [19.0760, 72.8777],
        Pune: [18.5204, 73.8567],
        Lonavala: [18.7566, 73.4072],
        Somnath: [20.8880, 70.4012],
        Nageshwar: [22.3346, 69.0135],
        Bhimashankar: [19.0719, 73.5358],
        Trimbakeshwar: [19.9320, 73.5312],
        Grishneshwar: [20.0242, 75.1720],
        Mahakaleshwar: [23.1827, 75.7682],
        Omkareshwar: [22.2449, 76.1491],
        Kedarnath: [30.7346, 79.0669],
        Baidyanath: [24.4925, 86.6997],
        Rameshwaram: [9.2876, 79.3129],
        Kamakhya: [26.1668, 91.7061],
        Kalighat: [22.5204, 88.3476],
        VaishnoDevi: [33.0298, 74.9482]
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

    const multiCityRoutes = new Set(['Varanasi', 'Prayagraj', 'Ayodhya', 'Lonavala', 'Trimbakeshwar']);

    // Draw destination lines and markers
    for (const [city, coords] of Object.entries(cities)) {
        if (city === 'Hyderabad') continue;

        if (!multiCityRoutes.has(city)) {
            // Draw dotted line
            L.polyline([hydCoords, coords], {
                color: '#ff2d55',
                weight: 2,
                dashArray: '5, 5',
                opacity: 0.4
            }).addTo(map);
        }

        // Draw city marker (Darkened spot)
        const marker = L.circleMarker(coords, {
            color: '#0f172a', // Dark slate border
            fillColor: '#1e293b', // Dark slate fill
            fillOpacity: 1,
            radius: 5,
            weight: 2
        }).addTo(map);

        // Add permanent label (Darker and larger text)
        marker.bindTooltip(`<b>${city}</b>`, {
            permanent: true,
            direction: 'right',
            className: 'map-city-label',
            offset: [5, 0],
            opacity: 0.9
        });
    }

    // Custom Round Route: Kashi (Varanasi) - Prayagraj - Ayodhya
    L.polyline([
        hydCoords,
        cities.Varanasi,
        cities.Prayagraj,
        cities.Ayodhya,
        hydCoords
    ], {
        color: '#ff2d55',
        weight: 2,
        dashArray: '5, 5',
        opacity: 0.4
    }).addTo(map);

    // Custom Round Route: Lonavala & Trimbakeshwar
    L.polyline([
        hydCoords,
        cities.Lonavala,
        cities.Trimbakeshwar,
        hydCoords
    ], {
        color: '#ff2d55',
        weight: 2,
        dashArray: '5, 5',
        opacity: 0.4
    }).addTo(map);
});
