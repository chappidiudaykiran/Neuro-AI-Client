const Jimp = require('jimp');

Jimp.read('src/assets/ecurve_logo_transparent.png')
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const a = this.bitmap.data[idx + 3];
      
      // If pixel is visible (not fully transparent)
      if (a > 0) {
        // Find dark pixels (text/logo parts) read from the original transparent logo
        if (r < 100 && g < 100 && b < 100) {
          // Convert to a nice Indigo / Violet (Tailwind Indigo-400): rgb(129, 140, 248)
          this.bitmap.data[idx + 0] = 129;  // R
          this.bitmap.data[idx + 1] = 140;  // G
          this.bitmap.data[idx + 2] = 248;  // B
        }
      }
    });
    return image.writeAsync('src/assets/ecurve_logo_darkmode.png');
  })
  .then(() => console.log('Successfully updated dark mode logo with Indigo!'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
