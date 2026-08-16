const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, 'assets');

// The source images
const images = [
    {
        src: path.join(ASSETS_DIR, 'goa.jpg'), // The high res one we copied earlier
        dest: path.join(ASSETS_DIR, 'hero-goa.webp')
    },
    {
        src: 'C:\\Users\\ADMIN\\.gemini\\antigravity-cli\\brain\\551acf31-5bdf-467f-814a-15d0f1fc32c1\\araku_hero_1786856565438.jpg',
        dest: path.join(ASSETS_DIR, 'hero-araku.webp')
    },
    {
        src: 'C:\\Users\\ADMIN\\.gemini\\antigravity-cli\\brain\\551acf31-5bdf-467f-814a-15d0f1fc32c1\\vizag_hero_1786857005538.jpg',
        dest: path.join(ASSETS_DIR, 'hero-vizag.webp')
    }
];

async function optimizeHero() {
    console.log('Optimizing hero images for maximum performance...');
    
    for (const img of images) {
        try {
            const inputBuffer = fs.readFileSync(img.src);
            const oldSize = inputBuffer.length;
            
            // Resize to standard 1080p and convert to WebP
            const pipeline = sharp(inputBuffer)
                .resize({ width: 1920, height: 1080, fit: 'cover', withoutEnlargement: true })
                .webp({ quality: 65, effort: 6 }); // Effort 6 = maximum compression efficiency
                
            const compressedBuffer = await pipeline.toBuffer();
            fs.writeFileSync(img.dest, compressedBuffer);
            
            const newSize = compressedBuffer.length;
            const savings = (((oldSize - newSize) / oldSize) * 100).toFixed(1);
            
            console.log(`Created ${path.basename(img.dest)}: ${(oldSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB (${savings}% smaller)`);
        } catch (err) {
            console.error(`Failed to process ${img.src}`, err);
        }
    }
}

optimizeHero();
