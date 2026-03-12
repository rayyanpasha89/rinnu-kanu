// Run: node generate-icons.js (requires canvas package, or just use any 192x192 and 512x512 PNG)
// For now, create simple placeholder icons

const fs = require('fs');

function createSVGIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#fdf6f0"/>
  <text x="50%" y="45%" text-anchor="middle" font-size="${size * 0.3}" font-family="serif" fill="#8b5e5e">R</text>
  <text x="50%" y="50%" text-anchor="middle" font-size="${size * 0.15}" fill="#d4847a">♥</text>
  <text x="50%" y="72%" text-anchor="middle" font-size="${size * 0.3}" font-family="serif" fill="#6b5e8b">K</text>
</svg>`;
}

// Save as SVG (browsers support SVG icons too)
fs.writeFileSync('public/icon-192.svg', createSVGIcon(192));
fs.writeFileSync('public/icon-512.svg', createSVGIcon(512));

console.log('Icons generated! For best results, convert to PNG using any image editor.');
console.log('Or just replace public/icon-192.png and public/icon-512.png with your own couple photo!');
