const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}=====================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}  TIMECAPSULE DEPLOYMENT PREPARATION${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}=====================================${colors.reset}\n`);

// Step 1: Check for required files
console.log(`${colors.bright}1. Checking required files${colors.reset}`);
const requiredFiles = [
  'public/manifest.json',
  'public/sw.js',
  'next.config.js'
];

let missingFiles = [];
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
    console.log(`   ${colors.red}✗ Missing: ${file}${colors.reset}`);
  } else {
    console.log(`   ${colors.green}✓ Found: ${file}${colors.reset}`);
  }
});

if (missingFiles.length > 0) {
  console.log(`\n${colors.red}Error: Missing required files. Please create them before deploying.${colors.reset}`);
  process.exit(1);
}

// Step 2: Check for icon files
console.log(`\n${colors.bright}2. Checking PWA icons${colors.reset}`);
const iconFiles = [
  'public/icons/icon-192x192.svg',
  'public/icons/icon-384x384.svg',
  'public/icons/icon-512x512.svg',
  'public/icons/apple-icon-180x180.svg'
];

let missingIcons = [];
iconFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    missingIcons.push(file);
    console.log(`   ${colors.red}✗ Missing: ${file}${colors.reset}`);
  } else {
    console.log(`   ${colors.green}✓ Found: ${file}${colors.reset}`);
  }
});

if (missingIcons.length > 0) {
  console.log(`\n${colors.yellow}Warning: Missing SVG icons. Run 'node scripts/generate-pwa-icons.js' to create placeholders.${colors.reset}`);
}

console.log(`\n${colors.yellow}Note: For production, convert SVG icons to PNG format and replace the placeholders.${colors.reset}`);

// Step 3: Check package.json for required dependencies
console.log(`\n${colors.bright}3. Checking required dependencies${colors.reset}`);
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDependencies = [
  'next-pwa'
];

let missingDependencies = [];
requiredDependencies.forEach(dep => {
  if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
    missingDependencies.push(dep);
    console.log(`   ${colors.red}✗ Missing: ${dep}${colors.reset}`);
  } else {
    console.log(`   ${colors.green}✓ Found: ${dep}${colors.reset}`);
  }
});

if (missingDependencies.length > 0) {
  console.log(`\n${colors.yellow}Warning: Missing required dependencies. Install them using:${colors.reset}`);
  console.log(`   npm install ${missingDependencies.join(' ')}`);
}

// Step 4: Check for next.config.js configuration
console.log(`\n${colors.bright}4. Checking next.config.js configuration${colors.reset}`);
const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

if (!nextConfigContent.includes('withPWA')) {
  console.log(`   ${colors.red}✗ next.config.js is not configured for PWA${colors.reset}`);
  console.log(`\n${colors.yellow}Warning: Your next.config.js does not appear to be configured for PWA. Update it based on the DEPLOYMENT.md instructions.${colors.reset}`);
} else {
  console.log(`   ${colors.green}✓ next.config.js is configured for PWA${colors.reset}`);
}

// Step 5: Provide deployment instructions
console.log(`\n${colors.bright}5. Deployment Instructions${colors.reset}`);
console.log(`
To deploy your application:

${colors.bright}Web Deployment:${colors.reset}
1. Build the application: ${colors.cyan}npm run build${colors.reset}
2. Choose a deployment method from DEPLOYMENT.md:
   - Vercel (Recommended): ${colors.cyan}vercel${colors.reset}
   - Netlify: ${colors.cyan}netlify deploy --prod${colors.reset}
   - AWS Amplify: ${colors.cyan}amplify publish${colors.reset}

${colors.bright}Android App (Capacitor):${colors.reset}
1. Install dependencies: ${colors.cyan}npm install @capacitor/core @capacitor/android${colors.reset}
2. Initialize Capacitor: ${colors.cyan}npx cap init TimeCapsule "TimeCapsule" --web-dir=out${colors.reset}
3. Build the app: ${colors.cyan}npm run build && next export -o out${colors.reset}
4. Add Android platform: ${colors.cyan}npx cap add android${colors.reset}
5. Copy web assets: ${colors.cyan}npx cap copy${colors.reset}
6. Open in Android Studio: ${colors.cyan}npx cap open android${colors.reset}
7. Build APK in Android Studio

${colors.bright}See DEPLOYMENT.md for detailed instructions.${colors.reset}
`);

console.log(`${colors.bright}${colors.green}Preparation complete!${colors.reset}`); 