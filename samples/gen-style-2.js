const d3 = require('d3-geo');
const fs = require('fs');
const https = require('https');
const sharp = require('sharp');
const path = require('path');

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
    Kudremukh: [75.2750, 13.2500],
    Tadoba: [79.3243, 20.2444],
    Pench: [79.2483, 21.6577],
    Kuntala: [78.4833, 19.3000],
    Ajanta: [75.3182, 19.8762],
    Nanded: [77.3090, 19.1492],
    Varanasi: [83.0039, 25.3176],
    Prayagraj: [81.8463, 25.4358],
    Ayodhya: [82.1998, 26.7922]
};

https.get('https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', async () => {
        try {
            const geojson = JSON.parse(data);
            const width = 800;
            const height = 900;

            const projection = d3.geoMercator()
                .fitSize([width, height], geojson);

            const pathGen = d3.geoPath().projection(projection);
            let svgPath = '';
            
            geojson.features.forEach(feature => {
                svgPath += pathGen(feature) + ' ';
            });

            const hyd = projection(cities.Hyderabad);

            const svgStyles = `
                <style>
                    .india-outline { fill: #0f0f1a; stroke: #4b0082; stroke-width: 4; opacity: 0.9; }
                    .city-dot { fill: #00f3ff; opacity: 0.9; }
                    .city-hub { fill: #ff2d55; }
                    .city-label { fill: #ffffff; font-size: 14px; font-family: sans-serif; text-anchor: middle; font-weight: bold; stroke: #0f0f1a; stroke-width: 3px; stroke-linejoin: round; paint-order: stroke fill; }
                    .hub-label { font-size: 16px; fill: #ff2d55; stroke: #0f0f1a; stroke-width: 3px; stroke-linejoin: round; paint-order: stroke fill; }
                    .route-line { stroke: #00f3ff; stroke-width: 1.5; stroke-dasharray: 4 4; opacity: 0.5; }
                </style>
            `;

            let svgHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' ' + height + '">';
            svgHtml += svgStyles;
            svgHtml += '<path class="india-outline" d="' + svgPath.trim() + '" />';
            
            for (const [city, coords] of Object.entries(cities)) {
                if (city === 'Hyderabad') continue;
                const pt = projection(coords);
                svgHtml += '<line class="route-line" x1="' + hyd[0] + '" y1="' + hyd[1] + '" x2="' + pt[0] + '" y2="' + pt[1] + '" />';
            }

            svgHtml += '<circle class="city-dot city-hub" cx="' + hyd[0] + '" cy="' + hyd[1] + '" r="10" />';
            svgHtml += '<text x="' + hyd[0] + '" y="' + (hyd[1] + 20) + '" class="city-label hub-label">HYDERABAD</text>';
            
            for (const [city, coords] of Object.entries(cities)) {
                if (city === 'Hyderabad') continue;
                const pt = projection(coords);
                svgHtml += '<circle class="city-dot" cx="' + pt[0] + '" cy="' + pt[1] + '" r="7" />';
                svgHtml += '<text x="' + pt[0] + '" y="' + (pt[1] + 15) + '" class="city-label">' + city + '</text>';
            }

            svgHtml += '</svg>';

            if (!fs.existsSync('samples')) {
                fs.mkdirSync('samples', { recursive: true });
            }

            const imagePath = 'samples/sample2.webp';
            await sharp(Buffer.from(svgHtml))
                .webp({ quality: 80 })
                .toFile(imagePath);
            console.log('Successfully generated ' + imagePath);

        } catch(e) {
            console.log('Error generating map:', e);
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
