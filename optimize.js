const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. COPY ARTIFACT IMAGES TO ASSETS
const brainDir = 'C:\\Users\\ADMIN\\.gemini\\antigravity-cli\\brain\\0a1b2785-d07d-4b75-9b45-d6f97854c132';
const assetsDir = path.join(__dirname, 'assets');

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

const files = fs.readdirSync(brainDir);
const jpgFiles = files.filter(f => f.endsWith('.jpg'));

jpgFiles.forEach(file => {
    fs.copyFileSync(path.join(brainDir, file), path.join(assetsDir, file));
});

// 2. REPLACE EXTERNAL IMAGES IN script.js
let scriptJs = fs.readFileSync('script.js', 'utf8');

// We have 12 JPGs. We will cycle through them for the 22 trips.
let imageIndex = 0;
scriptJs = scriptJs.replace(/image:\s*'https:\/\/loremflickr\.com[^']*'/g, () => {
    const localImg = `assets/${jpgFiles[imageIndex % jpgFiles.length]}`;
    imageIndex++;
    return `image: '${localImg}'`;
});

fs.writeFileSync('script.js', scriptJs);

// 3. REPLACE EXTERNAL IMAGES IN index.html (Hero Banner)
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/https:\/\/loremflickr\.com[^"]+/g, () => {
    const localImg = `assets/${jpgFiles[imageIndex % jpgFiles.length]}`;
    imageIndex++;
    return localImg;
});

// Add 5th floating button (YouTube) and ensure it's in index.html
if (!indexHtml.includes('float-yt')) {
    indexHtml = indexHtml.replace(
        /<a href="#" class="float-btn float-wa">.*?<\/a>/,
        '<a href="#" class="float-btn float-wa"><i class="fa-brands fa-whatsapp"></i></a>\n        <a href="#" class="float-btn float-yt"><i class="fa-brands fa-youtube"></i></a>'
    );
}
fs.writeFileSync('index.html', indexHtml);

// 4. FIX LAYOUT.CSS (Align items center for FAB and add YouTube color)
let layoutCss = fs.readFileSync('css/layout.css', 'utf8');
layoutCss = layoutCss.replace(
    /\.floating-action-bar\s*\{\s*position:\s*fixed;\s*right:\s*20px;\s*bottom:\s*30px;\s*display:\s*flex;\s*flex-direction:\s*column;\s*gap:\s*15px;\s*z-index:\s*9999;\s*\}/,
    `.floating-action-bar {
    position: fixed;
    right: 20px;
    bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    z-index: 9999;
}`
);

if (!layoutCss.includes('.float-yt')) {
    layoutCss = layoutCss.replace(
        /\.float-install\s*\{/,
        `.float-yt { color: #FF0000; }
.float-install {`
    );
}
fs.writeFileSync('css/layout.css', layoutCss);

// 5. REPLACE BACKGROUND IN CSS/BASE.CSS
let baseCss = fs.readFileSync('css/base.css', 'utf8');
baseCss = baseCss.replace(/url\('https:\/\/picsum\.photos[^']+'\)/, `url('../assets/${jpgFiles[0]}')`);
fs.writeFileSync('css/base.css', baseCss);

// 6. UPDATE BUILD.JS & LEGAL PAGES WITH YOUTUBE BUTTON
let buildJs = fs.readFileSync('build.js', 'utf8');
if (!buildJs.includes('float-yt')) {
    buildJs = buildJs.replace(
        /<a href="#" class="float-btn float-wa">.*?<\/a>/,
        '<a href="#" class="float-btn float-wa"><i class="fa-brands fa-whatsapp"></i></a>\n        <a href="#" class="float-btn float-yt"><i class="fa-brands fa-youtube"></i></a>'
    );
    fs.writeFileSync('build.js', buildJs);
}

['privacy.html', 'terms.html'].forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('float-yt')) {
            content = content.replace(
                /<a href="#" class="float-btn float-wa">.*?<\/a>/,
                '<a href="#" class="float-btn float-wa"><i class="fa-brands fa-whatsapp"></i></a>\n        <a href="#" class="float-btn float-yt"><i class="fa-brands fa-youtube"></i></a>'
            );
            fs.writeFileSync(file, content);
        }
    }
});

console.log("Optimization complete! Copied local images and updated code.");
