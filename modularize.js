const fs = require('fs');

// 1. Modularize CSS
const oldCss = fs.readFileSync('style.css', 'utf8');

// Extract root variables
let variablesCss = `/* css/variables.css */
:root {
    --bg-primary: #f8f9fa;
    --bg-secondary: #ffffff;
    --bg-card: #ffffff;
    --text-primary: #12121a;
    --text-secondary: #5a5a6e;
    --text-muted: #8b8b9e;
    --accent-pink: #ff2d55;
    --accent-cyan: #00b8d4;
    --accent-purple: #7c3aed;
    --accent-orange: #ff6b35;
    --accent-green: #00c853;
    --gradient-primary: linear-gradient(135deg, #ff2d55, #ff6b35);
    --gradient-secondary: linear-gradient(135deg, #00b8d4, #7c3aed);
    --gradient-card: linear-gradient(135deg, rgba(255, 45, 85, 0.05), rgba(124, 58, 237, 0.02));
    --glass-bg: rgba(255, 255, 255, 0.85);
    --glass-border: rgba(0, 0, 0, 0.08);
    --glass-hover: rgba(0, 0, 0, 0.04);
    --shadow-neon: 0 10px 30px rgba(255, 45, 85, 0.15);
    --shadow-cyan: 0 10px 30px rgba(0, 184, 212, 0.15);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
    --radius-xl: 28px;
    --radius-full: 9999px;
    --font-display: 'Outfit', sans-serif;
    --font-body: 'Space Grotesk', sans-serif;
    --transition-fast: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --transition-smooth: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --transition-spring: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}`;

let baseCss = oldCss.substring(oldCss.indexOf('/* Reset */'), oldCss.indexOf('/* ============================================') !== -1 ? oldCss.indexOf('/* ============================================', oldCss.indexOf('/* Reset */') + 1) : oldCss.length);
if(!baseCss || baseCss.length < 10) baseCss = oldCss.substring(oldCss.indexOf('/* Reset */'), oldCss.indexOf('/* Loader */') || oldCss.indexOf('.loader'));

const layoutCss = oldCss.substring(oldCss.indexOf('/* ============================================'), oldCss.length);

fs.writeFileSync('css/variables.css', variablesCss);
fs.writeFileSync('css/base.css', baseCss);
fs.writeFileSync('css/layout.css', layoutCss.replace(/background: var\(--bg-card\);/g, 'background: var(--bg-card);\n    box-shadow: 0 4px 15px rgba(0,0,0,0.03);')); // slight shadow for light theme

const mainCss = `@import url('css/variables.css');
@import url('css/base.css');
@import url('css/layout.css');
`;
fs.writeFileSync('style.css', mainCss);

// 2. Modularize Header and Footer in index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

const navStart = indexHtml.indexOf('<nav class="navbar" id="navbar">');
const navEnd = indexHtml.indexOf('</nav>') + 6;
const mobileMenuStart = indexHtml.indexOf('<div class="mobile-menu" id="mobile-menu">');
const mobileMenuEnd = indexHtml.indexOf('</div>', indexHtml.indexOf('</div>', mobileMenuStart) + 1) + 6; // Two divs deep

const headerHtml = indexHtml.substring(navStart, mobileMenuEnd);
fs.writeFileSync('components/header.html', headerHtml);

const footerStart = indexHtml.indexOf('<footer id="contact" class="footer">');
const footerEnd = indexHtml.indexOf('</footer>') + 9;
const floatingWaStart = indexHtml.indexOf('<a href="https://wa.me');
const floatingWaEnd = indexHtml.indexOf('</a>', floatingWaStart) + 4;

const footerHtml = indexHtml.substring(footerStart, floatingWaEnd);
fs.writeFileSync('components/footer.html', footerHtml);

// Replace with Custom Elements script
const componentScript = `
class SiteHeader extends HTMLElement {
    async connectedCallback() {
        const res = await fetch('components/header.html');
        this.innerHTML = await res.text();
        if(window.initNavbar) window.initNavbar();
    }
}
class SiteFooter extends HTMLElement {
    async connectedCallback() {
        const res = await fetch('components/footer.html');
        this.innerHTML = await res.text();
    }
}
customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
`;
fs.writeFileSync('js/components.js', componentScript);

indexHtml = indexHtml.substring(0, navStart) + '<site-header></site-header>' + indexHtml.substring(mobileMenuEnd, footerStart) + '<site-footer></site-footer>' + indexHtml.substring(floatingWaEnd);
indexHtml = indexHtml.replace('</head>', '    <script src="js/components.js"></script>\n</head>');
fs.writeFileSync('index.html', indexHtml);

// 3. Remove inline scripts/styles from build.js
let buildJs = fs.readFileSync('build.js', 'utf8');

const tripCss = `.trip-detail-hero {
    position: relative;
    height: 60vh;
    background-size: cover !important;
    background-position: center !important;
    display: flex;
    align-items: flex-end;
    padding: 4rem 2rem;
    margin-top: 70px;
}
.trip-detail-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, var(--bg-primary), rgba(255,255,255,0.2));
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
    color: var(--text-primary);
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
    color: var(--accent-pink);
    font-weight: 500;
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
    color: var(--text-secondary);
}
.highlights-list li i {
    color: var(--accent-cyan);
}
.booking-cta {
    background: var(--bg-card);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}
.booking-cta h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
}
.price-huge {
    font-size: 3rem;
    font-weight: 800;
    color: var(--accent-pink);
    margin-bottom: 1.5rem;
}
`;
fs.writeFileSync('css/trip.css', tripCss);

const tripJs = `function bookTrip(tripName, tripDate, tripPrice) {
    var phone = '918409358131';
    var msg = 'Hey sstravels! 🌟 I want to book a seat for *' + tripName + '* on ' + tripDate + '. Price: ₹' + tripPrice + '/seat. Please share details!';
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
}
function shareTripDetail(tripName) {
    var shareData = {
        title: tripName + ' - sstravels',
        text: 'Hey! Check out this trip to ' + tripName + ' with sstravels! 🚀',
        url: window.location.href,
    };
    if (navigator.share) navigator.share(shareData);
    else {
        navigator.clipboard.writeText(shareData.url);
        alert("Link copied!");
    }
}`;
fs.writeFileSync('js/trip.js', tripJs);

// Update build.js to use external css/js
buildJs = buildJs.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="../css/trip.css">');
buildJs = buildJs.replace(/<script>[\s\S]*?<\/script>/, '<script src="../js/trip.js"></script>');
buildJs = buildJs.replace(/background: url\('\.\.\/\${trip\.image}'\) center\/cover no-repeat;/, `style="background: url('../\${trip.image}')"`);
buildJs = buildJs.replace(/onclick="bookTrip\(\)"/, `onclick="bookTrip('\${trip.name}', '\${trip.date}', '\${trip.price}')"`);
buildJs = buildJs.replace(/onclick="shareTrip\(\)"/, `onclick="shareTripDetail('\${trip.name}')"`);
buildJs = buildJs.replace(/<nav[\s\S]*?<\/nav>/, '<script src="../js/components.js"></script><site-header></site-header>');
buildJs = buildJs.replace(/<footer[\s\S]*?<\/footer>/, '<site-footer></site-footer>');
fs.writeFileSync('build.js', buildJs);

// Also remove inline styles in script.js for trip cards
let scriptJs = fs.readFileSync('script.js', 'utf8');
// Replace inline anchor style
scriptJs = scriptJs.replace(/style="margin-bottom: 1rem;"/g, 'class="card-expanded-link"');
scriptJs = scriptJs.replace(/style="color:var\(--accent-primary\);text-decoration:none;font-size:0.9rem;"/g, '');
// Add card-expanded-link to layout.css
fs.appendFileSync('css/layout.css', `\n.card-expanded-link { margin-bottom: 1rem; }\n.card-expanded-link a { color: var(--accent-pink); text-decoration: none; font-size: 0.9rem; font-weight: 500; }\n`);
fs.writeFileSync('script.js', scriptJs);

// Add initNavbar function for when header loads dynamically
fs.appendFileSync('script.js', `\nwindow.initNavbar = function() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if(hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
};\n`);

console.log("Modularization complete.");
