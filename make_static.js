const https = require('https');
const fs = require('fs');
const path = require('path');

const downloadFile = (url, dest, options = {}) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, options, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadFile(response.headers.location, dest, options).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

const fetchText = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
};

async function makeStatic() {
    console.log("Starting static asset localizer...");

    // 1. Create directories
    ['js/vendor', 'css', 'webfonts', 'fonts'].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    // 2. Download Scripts
    console.log("Downloading scripts...");
    await downloadFile('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'js/vendor/three.min.js');
    await downloadFile('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', 'js/vendor/gsap.min.js');
    await downloadFile('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', 'js/vendor/ScrollTrigger.min.js');

    // 3. Download FontAwesome
    console.log("Downloading FontAwesome...");
    await downloadFile('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css', 'css/all.min.css');
    const faFonts = [
        'fa-brands-400.woff2', 'fa-brands-400.ttf',
        'fa-solid-900.woff2', 'fa-solid-900.ttf',
        'fa-regular-400.woff2', 'fa-regular-400.ttf',
        'fa-v4compat.woff2', 'fa-v4compat.ttf'
    ];
    for (const font of faFonts) {
        await downloadFile(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/${font}`, `webfonts/${font}`).catch(e => console.log(`Skipped ${font}`));
    }

    // 4. Download Google Fonts
    console.log("Downloading Google Fonts...");
    const gfUrl = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap';
    const gfOptions = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' } };
    
    let fontsCss = await fetchText(gfUrl, gfOptions);
    
    // Parse WOFF2 urls and download them
    const urlRegex = /url\((https:\/\/[^)]+)\)/g;
    let match;
    let fontIndex = 0;
    while ((match = urlRegex.exec(fontsCss)) !== null) {
        const url = match[1];
        const filename = `font-${fontIndex++}.woff2`;
        await downloadFile(url, `fonts/${filename}`);
        fontsCss = fontsCss.replace(url, `../fonts/${filename}`);
    }
    fs.writeFileSync('css/fonts.css', fontsCss);

    // 5. Replace references in HTML
    console.log("Updating HTML files...");
    const htmlFiles = ['index.html', 'privacy.html', 'terms.html', 'build.js'];
    
    htmlFiles.forEach(file => {
        if (!fs.existsSync(file)) return;
        let content = fs.readFileSync(file, 'utf8');

        // Remove preconnects
        content = content.replace(/<link rel="preconnect" href="https:\/\/fonts.googleapis.com">/g, '');
        content = content.replace(/<link rel="preconnect" href="https:\/\/fonts.gstatic.com" crossorigin>/g, '');
        content = content.replace(/<link rel="preconnect" href="https:\/\/loremflickr.com">/g, '');
        
        // Replace Google Fonts
        content = content.replace(/<link href="https:\/\/fonts.googleapis.com\/css2[^"]+" rel="stylesheet">/g, '<link rel="stylesheet" href="css/fonts.css">');
        
        // Replace FontAwesome (6.5.0 and 6.4.0)
        content = content.replace(/<link rel="stylesheet" href="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome\/6\.[45]\.0\/css\/all.min.css">/g, '<link rel="stylesheet" href="css/all.min.css">');
        
        // Replace Scripts
        content = content.replace(/<script src="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/three.js\/r128\/three.min.js"><\/script>/g, '<script src="js/vendor/three.min.js"></script>');
        content = content.replace(/<script src="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/gsap\/3.12.2\/gsap.min.js"><\/script>/g, '<script src="js/vendor/gsap.min.js"></script>');
        content = content.replace(/<script src="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/gsap\/3.12.2\/ScrollTrigger.min.js"><\/script>/g, '<script src="js/vendor/ScrollTrigger.min.js"></script>');
        
        fs.writeFileSync(file, content);
    });

    console.log("Localization complete!");
}

makeStatic().catch(console.error);
