const d3 = require('d3-geo');
const fs = require('fs');
const https = require('https');

const cities = {
    Hyderabad: [78.4867, 17.3850],
    Goa: [74.1240, 15.2993],
    Hampi: [76.4600, 15.3350],
    Araku: [82.8790, 18.3333],
    Chirala: [80.3547, 15.8167],
    Warangal: [79.5941, 17.9689],
    Pondicherry: [79.8083, 11.9416],
    Gandikota: [78.2842, 14.8145],
    Vizag: [83.2185, 17.6868],
    Srisailam: [78.8711, 16.0730],
    Coorg: [75.7392, 12.3375],
    Mysore: [76.6394, 12.2958],
    Ooty: [76.6932, 11.4100],
    Munnar: [77.0595, 10.0889],
    Gokarna: [74.3188, 14.5422],
    Dandeli: [74.6190, 15.2415],
    Chikmagalur: [75.7725, 13.3161],
    Horsley: [78.3980, 13.6508],
    Lambasingi: [82.4900, 17.8167],
    Ananthagiri: [77.8548, 17.3101],
    Belum: [78.1118, 15.1027],
    Lepakshi: [77.6080, 13.8037],
    Nagarjuna: [79.3134, 16.5770],
    Kodaikanal: [77.4892, 10.2381],
    Alleppey: [76.3388, 9.4981],
    Mahabalipuram: [80.1937, 12.6269],
    Dudhsagar: [74.3143, 15.3144],
    Mantralayam: [77.4326, 15.9427],
    Ahobilam: [78.7183, 15.1326],
    Ethipothala: [79.3167, 16.5500],
    Kudremukh: [75.2750, 13.2500]
};

https.get('https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        try {
            const geojson = JSON.parse(data);
            const width = 800;
            const height = 900;

            const projection = d3.geoMercator()
                .fitSize([width, height], geojson);

            const path = d3.geoPath().projection(projection);
            let svgPath = '';
            
            geojson.features.forEach(feature => {
                svgPath += path(feature) + ' ';
            });

            const hyd = projection(cities.Hyderabad);

            let svgHtml = '<svg id="india-map" viewBox="0 0 ' + width + ' ' + height + '" class="india-map">';
            svgHtml += '<path class="india-outline" d="' + svgPath.trim() + '" />';
            svgHtml += '<circle class="city-dot city-hub" cx="' + hyd[0] + '" cy="' + hyd[1] + '" r="8" data-city="Hyderabad" />';
            svgHtml += '<text x="' + hyd[0] + '" y="' + (hyd[1] + 20) + '" class="city-label hub-label">HYDERABAD</text>';
            svgHtml += '<g class="routes-group">';

            for (const [city, coords] of Object.entries(cities)) {
                if (city === 'Hyderabad') continue;
                const pt = projection(coords);
                svgHtml += '<line class="route-line" x1="' + hyd[0] + '" y1="' + hyd[1] + '" x2="' + pt[0] + '" y2="' + pt[1] + '" data-dest="' + city.toLowerCase() + '" />';
                svgHtml += '<circle class="city-dot" cx="' + pt[0] + '" cy="' + pt[1] + '" r="5" data-city="' + city + '" />';
                svgHtml += '<text x="' + pt[0] + '" y="' + (pt[1] + 15) + '" class="city-label">' + city + '</text>';
            }

            svgHtml += '</g></svg>';

            let html = fs.readFileSync('index.html', 'utf8');
            html = html.replace(/<svg id="india-map"[\s\S]*?<\/svg>/, svgHtml);
            fs.writeFileSync('index.html', html);
            console.log('Successfully updated index.html with accurate India SVG map');
        } catch(e) {
            console.log('Failed to parse geojson', e);
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
