const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const imageExtensions = ['.png', '.jpg', '.jpeg'];

async function optimizeImages() {
  try {
    const files = fs.readdirSync(publicDir);
    
    for (const file of files) {
      const filePath = path.join(publicDir, file);
      const ext = path.extname(file).toLowerCase();
      
      if (imageExtensions.includes(ext)) {
        const name = path.parse(file).name;
        const webpPath = path.join(publicDir, `${name}.webp`);
        
        console.log(`Converting ${file} to WebP...`);
        
        await sharp(filePath)
          .webp({ quality: 85 })
          .toFile(webpPath);
        
        console.log(`✓ Created ${name}.webp`);
      }
    }
    
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();