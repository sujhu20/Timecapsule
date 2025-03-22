const fs = require('fs');
const path = require('path');

// Function to create a simple placeholder SVG for icons
function createSvgPlaceholder(size, text) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#7c3aed"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${size/8}px" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
}

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icons we need to generate
const icons = [
  { size: 192, name: 'icon-192x192.png', text: 'TC' },
  { size: 384, name: 'icon-384x384.png', text: 'TC' },
  { size: 512, name: 'icon-512x512.png', text: 'TimeCapsule' },
  { size: 180, name: 'apple-icon-180x180.png', text: 'TC' }
];

// Generate each icon
console.log('Generating PWA icon placeholders...');
icons.forEach(icon => {
  const svgContent = createSvgPlaceholder(icon.size, icon.text);
  const svgPath = path.join(iconsDir, `${icon.name.replace('.png', '.svg')}`);
  
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Created ${svgPath}`);
  
  console.log(`NOTE: You'll need to convert these SVGs to PNGs manually.`);
  console.log(`For a production app, replace these with properly designed icons.`);
});

// Create a simple favicon.ico placeholder - note this is just a text file reminder
const faviconPath = path.join(iconsDir, 'favicon.ico');
fs.writeFileSync(faviconPath, 'This is a placeholder. Replace with a real ICO file.');
console.log(`Created reminder for ${faviconPath}`);

console.log('\nDone! For a real application:');
console.log('1. Convert the SVGs to PNGs using an image editor or online service');
console.log('2. Create a proper favicon.ico file');
console.log('3. Replace all placeholders with your designed app icons'); 