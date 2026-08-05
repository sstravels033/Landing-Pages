const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, 'assets');
const MAX_WIDTH = 800;
const JPEG_QUALITY = 60;
const PNG_QUALITY = 60;

async function compressImages() {
  const files = fs.readdirSync(ASSETS_DIR);
  let totalOldSize = 0;
  let totalNewSize = 0;

  console.log(`Starting image compression in ${ASSETS_DIR}...`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      continue;
    }

    const filePath = path.join(ASSETS_DIR, file);
    const stat = fs.statSync(filePath);
    const oldSize = stat.size;
    totalOldSize += oldSize;

    try {
      const inputBuffer = fs.readFileSync(filePath);
      let pipeline = sharp(inputBuffer).resize({
        width: MAX_WIDTH,
        withoutEnlargement: true
      });

      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });
      } else if (ext === '.png') {
        pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({ quality: JPEG_QUALITY });
      }

      const compressedBuffer = await pipeline.toBuffer();
      fs.writeFileSync(filePath, compressedBuffer);

      const newSize = compressedBuffer.length;
      totalNewSize += newSize;

      const savings = (((oldSize - newSize) / oldSize) * 100).toFixed(1);
      console.log(`Compressed ${file}: ${(oldSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (${savings}% reduction)`);
    } catch (err) {
      console.error(`Failed to compress ${file}:`, err.message);
      totalNewSize += oldSize; // fallback to old size in total calculation
    }
  }

  const totalSaved = totalOldSize - totalNewSize;
  const totalSavingsPct = (((totalOldSize - totalNewSize) / totalOldSize) * 100).toFixed(1);
  console.log('\n--- Compression Summary ---');
  console.log(`Original total size: ${(totalOldSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Compressed total size: ${(totalNewSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total saved: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB (${totalSavingsPct}% reduction)`);
}

compressImages();
