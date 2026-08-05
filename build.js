const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('script.js', 'utf8');
const match = content.match(/const TRIPS = (\[[\s\S]*?\]);\n/);

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

    <link rel="stylesheet" href="css/fonts.css">
    <link rel="stylesheet" href="css/all.min.css">
        <link rel="stylesheet" href="../css/variables.css">
    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/layout.css">
    
    <link rel="stylesheet" href="../css/trip.css">
    <script src="../js/vendor/lenis.min.js" defer></script>
    <script src="../js/trip.js" defer></script>
</head>
<body>
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="#" class="logo">
                <img src="assets/logo.png" alt="sstravels logo - stylized 'ss' letters in neon pink gradient forming an infinity loop with 'travels' in clean white modern font, set against dark background" class="logo-img">
            </a>
            <div class="nav-links" id="nav-links">
                <a href="#hero" class="nav-link" data-text="Home">Home</a>
                <a href="#map-section" class="nav-link" data-text="Explore">Explore</a>
                <a href="#trips" class="nav-link" data-text="Trips">Trips</a>
                <a href="#safety" class="nav-link" data-text="Safety">Safety</a>
                <a href="#contact" class="nav-link" data-text="Contact">Contact</a>
            </div>
            <button class="hamburger" id="hamburger" aria-label="Toggle menu">
                <span></span><span></span><span></span>
            </button>
        </div>
    </nav>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobile-menu">
        <div class="mobile-menu-inner">
            <a href="#hero" class="mobile-link">Home</a>
            <a href="#map-section" class="mobile-link">Explore</a>
            <a href="#trips" class="mobile-link">Trips</a>
            <a href="#safety" class="mobile-link">Safety</a>
            <a href="#contact" class="mobile-link">Contact</a>
        </div>
    </div>

    <header class="trip-mesh-hero">
        <div class="mesh-bg"></div>
        <div class="mesh-noise"></div>
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
            <p class='disclaimer' style='font-size:0.85rem; color:var(--text-muted); margin-top:1rem;'>*Note: This price includes travel only. Food and accommodation are included only if explicitly mentioned in the package highlights.</p>
        </div>
    </main>

    <footer id="contact" class="footer">
        <div class="footer-container">
            <div class="footer-top">
                <div class="footer-brand">
                    <img src="assets/logo.png" alt="sstravels logo - neon pink infinity loop 'ss' with modern white 'travels' text on dark background" class="footer-logo-img">
                    <p>Weekend escapes from Hyderabad for young, adventurous souls. Safe, affordable, unforgettable.</p>
                </div>
                <div class="footer-links">
                    <h4>Quick Links</h4>
                    <a href="#trips">All Trips</a>
                    <a href="#safety">Safety</a>
                    <a href="#map-section">Explore</a>
                </div>
                <div class="footer-links">
                    <h4>Connect</h4>
                    <a href="https://wa.me/918409358131" target="_blank"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>

    
    <div class="floating-action-bar">
        <button class="float-btn float-install" id="float-install-btn" title="Install App"><i class="fa-solid fa-download"></i></button>
        <a href="#" class="float-btn float-yt"><i class="fa-brands fa-youtube"></i></a>
        <a href="#" class="float-btn float-ig"><i class="fa-brands fa-instagram"></i></a>
        <a href="#" class="float-btn float-fb"><i class="fa-brands fa-facebook"></i></a>
        <a href="https://wa.me/918409358131?text=Hey%20sstravels!%20I%20want%20to%20know%20about%20upcoming%20trips." target="_blank" class="float-btn float-wa"><i class="fa-brands fa-whatsapp"></i></a>
    </div>
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

