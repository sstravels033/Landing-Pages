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
    
    <style>
        .trip-detail-hero {
            position: relative;
            height: 60vh;
            background: url('../${trip.image}') center/cover no-repeat;
            display: flex;
            align-items: flex-end;
            padding: 4rem 2rem;
            margin-top: 70px;
        }
        .trip-detail-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(11,12,16,1), rgba(11,12,16,0.2));
        }
        .trip-detail-content {
            position: relative;
            z-index: 10;
            max-width: 800px;
            margin: 0 auto;
            width: 100%;
        }
        .trip-detail-content h1 {
            font-size: 3.5rem;
            font-family: 'Outfit', sans-serif;
            margin-bottom: 1rem;
        }
        .trip-meta-tags {
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
        }
        .trip-meta-tags span {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--accent-secondary);
        }
        .trip-main-section {
            max-width: 800px;
            margin: 4rem auto;
            padding: 0 2rem;
        }
        .trip-main-section h2 {
            margin-bottom: 1.5rem;
            font-size: 2rem;
        }
        .trip-main-section p {
            font-size: 1.1rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
            line-height: 1.8;
        }
        .highlights-list {
            list-style: none;
            padding: 0;
            margin-bottom: 3rem;
        }
        .highlights-list li {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .highlights-list li i {
            color: var(--accent-primary);
        }
        .booking-cta {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
        }
        .booking-cta h3 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        .price-huge {
            font-size: 3rem;
            font-weight: 800;
            color: var(--accent-secondary);
            margin-bottom: 1.5rem;
        }
    </style>
</head>
<body>
    <nav class="navbar scrolled" id="navbar">
        <div class="nav-container">
            <a href="../index.html" class="logo">
                <img src="../assets/logo.png" alt="sstravels logo" class="logo-img">
            </a>
            <div class="nav-links">
                <a href="../index.html" class="nav-link">← Back to Home</a>
            </div>
        </div>
    </nav>

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
            <button class="btn btn-primary" onclick="bookTrip()"><i class="fa-brands fa-whatsapp"></i> Book on WhatsApp</button>
            <button class="btn btn-glass" onclick="shareTrip()"><i class="fa-solid fa-share-nodes"></i> Share Trip</button>
        </div>
    </main>

    <footer class="footer">
        <div class="footer-bottom">
            <p>&copy; 2026 sstravels. All rights reserved.</p>
        </div>
    </footer>

    <script>
        function bookTrip() {
            var phone = '918409358131';
            var msg = 'Hey sstravels! 🌟 I want to book a seat for *${trip.name}* on ${trip.date}. Price: ₹${trip.price}/seat. Please share details!';
            window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
        }
        function shareTrip() {
            var shareData = {
                title: '${trip.name} - sstravels',
                text: 'Hey! Check out this trip: ${trip.name} by sstravels. 🚀',
                url: window.location.href,
            };
            if (navigator.share) navigator.share(shareData);
            else {
                navigator.clipboard.writeText(shareData.url);
                alert("Link copied!");
            }
        }
    </script>
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
