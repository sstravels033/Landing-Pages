const fs = require('fs');
const path = require('path');

// 1. HARDCODE DATES IN script.js
let scriptJs = fs.readFileSync('script.js', 'utf8');

// The getNextWeekend function logic to evaluate
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

// Regex to replace date: getNextWeekend(X) with date: 'DD MMM - DD MMM'
scriptJs = scriptJs.replace(/date:\s*getNextWeekend\((\d+)\)/g, (match, p1) => {
    return `date: '${getNextWeekend(parseInt(p1))}'`;
});

// Remove the getNextWeekend function entirely from script.js
scriptJs = scriptJs.replace(/function getNextWeekend\([\s\S]*?\}\n/, '');

// Remove the installModal auto-show logic from script.js
scriptJs = scriptJs.replace(/setTimeout\(function \(\) \{\s*if \(\!window\.matchMedia\('\(display-mode: standalone\)'\)\.matches\) \{\s*installModal\.classList\.add\('active'\);\s*\}\s*\}, 5000\);/g, '');
// Also make the float button trigger install
scriptJs = scriptJs.replace(/var installBtn = document\.getElementById\('install-btn'\);/, "var installBtn = document.getElementById('float-install-btn');");

fs.writeFileSync('script.js', scriptJs);

// 2. CREATE LEGAL PAGES
const template = fs.readFileSync('trips/goa.html', 'utf8'); // We use this as a base template just to extract the HTML structure. Actually, let's just make it from scratch based on index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

const privacyContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - sstravels</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="css/trip.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <script src="js/components.js"></script><site-header></site-header>
    <main style="padding: 150px 2rem; max-width: 800px; margin: 0 auto; color: var(--text-primary);">
        <h1>Privacy Policy</h1>
        <p style="margin-top:20px; color: var(--text-secondary);">Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information when you book trips with sstravels.</p>
        <h3 style="margin-top:20px;">1. Information We Collect</h3>
        <p style="color: var(--text-secondary);">We collect basic contact details necessary for booking and travel insurance.</p>
        <h3 style="margin-top:20px;">2. How We Use Information</h3>
        <p style="color: var(--text-secondary);">Your information is used solely for the purpose of fulfilling your travel bookings and is never sold to third parties.</p>
    </main>
    <site-footer></site-footer>
</body>
</html>`;

const termsContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms and Conditions - sstravels</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="css/trip.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <script src="js/components.js"></script><site-header></site-header>
    <main style="padding: 150px 2rem; max-width: 800px; margin: 0 auto; color: var(--text-primary);">
        <h1>Terms and Conditions</h1>
        <p style="margin-top:20px; color: var(--text-secondary);">By booking a trip with sstravels, you agree to the following terms and conditions.</p>
        <h3 style="margin-top:20px;">1. Cancellations</h3>
        <p style="color: var(--text-secondary);">Cancellations made 48 hours prior to departure are eligible for a 50% refund. Later cancellations are non-refundable.</p>
        <h3 style="margin-top:20px;">2. Inclusions</h3>
        <p style="color: var(--text-secondary);">Unless explicitly stated in the package highlights, food and accommodation are not included in the base travel fare.</p>
    </main>
    <site-footer></site-footer>
</body>
</html>`;

fs.writeFileSync('privacy.html', privacyContent);
fs.writeFileSync('terms.html', termsContent);

// 3. UPDATE FOOTER (Remove Socials, Add Legal)
let footerHtml = fs.readFileSync('components/footer.html', 'utf8');
footerHtml = footerHtml.replace(/<div class="footer-socials">[\s\S]*?<\/div>/, '');
footerHtml = footerHtml.replace(/<ul class="footer-links">/, '<ul class="footer-links">\n                <li><a href="privacy.html">Privacy Policy</a></li>\n                <li><a href="terms.html">Terms & Conditions</a></li>');
fs.writeFileSync('components/footer.html', footerHtml);

// 4. ADD FLOATING ACTION BAR TO INDEX.HTML & REMOVE INSTALL MODAL
// Remove install modal
indexHtml = indexHtml.replace(/<!-- Install App Modal -->[\s\S]*?<\/div>\s*<\/div>/, '');

const floatingBarHtml = `
    <!-- Floating Action Bar -->
    <div class="floating-action-bar">
        <a href="#" class="float-btn"><i class="fa-brands fa-instagram"></i></a>
        <a href="#" class="float-btn"><i class="fa-brands fa-facebook"></i></a>
        <a href="#" class="float-btn"><i class="fa-brands fa-whatsapp"></i></a>
        <button class="float-btn" id="float-install-btn" title="Install App"><i class="fa-solid fa-download"></i></button>
    </div>
`;
if (!indexHtml.includes('floating-action-bar')) {
    indexHtml = indexHtml.replace(/<\/body>/, floatingBarHtml + '\n</body>');
}
fs.writeFileSync('index.html', indexHtml);

// 5. ADD CSS FOR FLOATING ACTION BAR
let layoutCss = fs.readFileSync('css/layout.css', 'utf8');
const floatCss = `
.floating-action-bar {
    position: fixed;
    right: 20px;
    bottom: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 9999;
}
.float-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    font-size: 1.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: var(--transition-smooth);
    text-decoration: none;
    cursor: pointer;
}
.float-btn:hover {
    transform: translateY(-5px);
    background: var(--gradient-primary);
    color: white;
}
`;
if (!layoutCss.includes('.floating-action-bar')) {
    layoutCss += floatCss;
    fs.writeFileSync('css/layout.css', layoutCss);
}

console.log("All tasks successfully executed!");
