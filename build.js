const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('script.js', 'utf8');
const match = content.match(/const TRIPS = (\[[\s\S]*?\]);\n\n    function getNextWeekend/);

if (!match) {
    console.error("Could not parse TRIPS from script.js");
    process.exit(1);
}

function getNextWeekend(weeksFromNow) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSat = (6 - dayOfWeek + 7) % 7 || 7;
    const nextSat = new Date(today);
    nextSat.setDate(today.getDate() + daysUntilSat + (weeksFromNow * 7));
    const nextSun = new Date(nextSat);
    nextSun.setDate(nextSat.getDate() + 1);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${nextSat.getDate()} ${months[nextSat.getMonth()]} - ${nextSun.getDate()} ${months[nextSun.getMonth()]}`;
}

const trips = eval(match[1]);

if (!fs.existsSync('trips')) {
    fs.mkdirSync('trips');
}

trips.forEach(trip => {
    let highlightsHtml = "";
    trip.highlights.forEach(h => {
        highlightsHtml += "<li><i class='fa-solid fa-check-circle'></i> " + h + "</li>";
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${trip.name} | sstravels</title>
    <meta name="description" content="${trip.desc}">
    <meta name="keywords" content="${trip.name}, ${trip.category}, weekend trip hyderabad, budget travel">
    
    <meta property="og:title" content="${trip.name} | sstravels">
    <meta property="og:description" content="${trip.desc}">
    <meta property="og:image" content="https://sstravels033.github.io/Landing-Pages/${trip.image}">
    <meta property="og:url" content="https://sstravels033.github.io/Landing-Pages/trips/${trip.id}.html">
    <meta property="og:type" content="website">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${trip.name} | sstravels">
    <meta name="twitter:description" content="${trip.desc}">
    <meta name="twitter:image" content="https://sstravels033.github.io/Landing-Pages/${trip.image}">

    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#ff2d55">
    <link rel="icon" type="image/png" sizes="32x32" href="../assets/icon-192.png">
    <link rel="apple-touch-icon" href="../assets/icon-192.png">

    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../style.css">
    
    <link rel="stylesheet" href="../css/trip.css">
</head>
<body>
    <script src="../js/components.js"></script><site-header></site-header>

    <header class="trip-detail-hero">
        <div class="trip-detail-overlay"></div>
        <div class="trip-detail-content">
            <h1>${trip.name}</h1>
            <div class="trip-meta-tags">
                <span><i class="fa-regular fa-calendar"></i> ${trip.date}</span>
                <span><i class="fa-regular fa-clock"></i> ${trip.duration}</span>
                <span><i class="fa-solid fa-campground"></i> ${trip.stay}</span>
            </div>
        </div>
    </header>

    <main class="trip-main-section">
        <h2>About The Escape</h2>
        <p>${trip.desc}</p>
        
        <h2>Trip Highlights</h2>
        <ul class="highlights-list">
            ${highlightsHtml}
        </ul>

        <div class="booking-cta">
            <h3>Ready to join?</h3>
            <div class="price-huge">₹${trip.price.toLocaleString('en-IN')} <span style="font-size:1rem;color:var(--text-secondary)">per seat</span></div>
            <button class="btn btn-primary" onclick="bookTrip('${trip.name}', '${trip.date}', '${trip.price}')"><i class="fa-brands fa-whatsapp"></i> Book on WhatsApp</button>
            <button class="btn btn-glass" onclick="shareTripDetail('${trip.name}')"><i class="fa-solid fa-share-nodes"></i> Share Trip</button>
        </div>
    </main>

    <site-footer></site-footer>

    <script src="../js/trip.js"></script>
</body>
</html>`;
    
    fs.writeFileSync(path.join('trips', trip.id + '.html'), html);
});
console.log('Successfully generated ' + trips.length + ' trip pages.');

const baseUrl = 'https://sstravels033.github.io/Landing-Pages';
let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
sitemap += `    <url>\n        <loc>${baseUrl}/index.html</loc>\n        <changefreq>weekly</changefreq>\n        <priority>1.0</priority>\n    </url>\n`;

trips.forEach(trip => {
    sitemap += `    <url>\n        <loc>${baseUrl}/trips/${trip.id}.html</loc>\n        <changefreq>weekly</changefreq>\n        <priority>0.8</priority>\n    </url>\n`;
});
sitemap += '</urlset>';
fs.writeFileSync('sitemap.xml', sitemap);
console.log('Successfully generated sitemap.xml');

const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;
fs.writeFileSync('robots.txt', robotsTxt);
console.log('Successfully generated robots.txt');

let scriptJs = fs.readFileSync('script.js', 'utf8');
scriptJs = scriptJs.replace(/openTripModal\(trip\);/g, "window.location.href = 'trips/' + trip.id + '.html';");
fs.writeFileSync('script.js', scriptJs);
console.log('Updated script.js to navigate to trip pages');
