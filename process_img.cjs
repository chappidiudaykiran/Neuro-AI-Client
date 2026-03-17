const Jimp = require('jimp');

Jimp.read('src/assets/ecurve logo.jpg')
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      if (r > 200 && g > 200 && b > 200) {
        this.bitmap.data[idx + 3] = 0; // alpha clear
      }
    });
    return image.writeAsync('src/assets/ecurve_logo_transparent.png');
  })
  .then(() => console.log('Successfully created transparent logo!'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
