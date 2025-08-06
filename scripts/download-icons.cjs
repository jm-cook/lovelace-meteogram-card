const fs = require('fs');
const https = require('https');
const path = require('path');

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// List of weather symbol codes used by Met.no API
const weatherSymbols = [
  'clearsky_day', 'clearsky_night', 'clearsky_polartwilight',
  'cloudy', 'fair_day', 'fair_night', 'fair_polartwilight',
  'fog', 'heavyrain', 'heavyrainandthunder',
  'heavyrainshowers_day', 'heavyrainshowers_night', 'heavyrainshowers_polartwilight',
  'heavyrainshowersandthunder_day', 'heavyrainshowersandthunder_night', 'heavyrainshowersandthunder_polartwilight',
  'heavysleet', 'heavysleetandthunder',
  'heavysleetshowers_day', 'heavysleetshowers_night', 'heavysleetshowers_polartwilight',
  'heavysleetshowersandthunder_day', 'heavysleetshowersandthunder_night', 'heavysleetshowersandthunder_polartwilight',
  'heavysnow', 'heavysnowandthunder',
  'heavysnowshowers_day', 'heavysnowshowers_night', 'heavysnowshowers_polartwilight',
  'heavysnowshowersandthunder_day', 'heavysnowshowersandthunder_night', 'heavysnowshowersandthunder_polartwilight',
  'lightrain', 'lightrainandthunder',
  'lightrainshowers_day', 'lightrainshowers_night', 'lightrainshowers_polartwilight',
  'lightrainshowersandthunder_day', 'lightrainshowersandthunder_night', 'lightrainshowersandthunder_polartwilight',
  'lightsleet', 'lightsleetandthunder',
  'lightsleetshowers_day', 'lightsleetshowers_night', 'lightsleetshowers_polartwilight',
  'lightsleetshowersandthunder_day', 'lightsleetshowersandthunder_night', 'lightsleetshowersandthunder_polartwilight',
  'lightsnow', 'lightsnowandthunder',
  'lightsnowshowers_day', 'lightsnowshowers_night', 'lightsnowshowers_polartwilight',
  'lightsnowshowersandthunder_day', 'lightsnowshowersandthunder_night', 'lightsnowshowersandthunder_polartwilight',
  'partlycloudy_day', 'partlycloudy_night', 'partlycloudy_polartwilight',
  'rain', 'rainandthunder',
  'rainshowers_day', 'rainshowers_night', 'rainshowers_polartwilight',
  'rainshowersandthunder_day', 'rainshowersandthunder_night', 'rainshowersandthunder_polartwilight',
  'sleet', 'sleetandthunder',
  'sleetshowers_day', 'sleetshowers_night', 'sleetshowers_polartwilight',
  'sleetshowersandthunder_day', 'sleetshowersandthunder_night', 'sleetshowersandthunder_polartwilight',
  'snow', 'snowandthunder',
  'snowshowers_day', 'snowshowers_night', 'snowshowers_polartwilight',
  'snowshowersandthunder_day', 'snowshowersandthunder_night', 'snowshowersandthunder_polartwilight',
  'thunder'
];

// Special cases - typos in the API that need to be handled
const specialCases = [
  'lightssleetshowersandthunder_day', 'lightssleetshowersandthunder_night', 'lightssleetshowersandthunder_polartwilight',
  'lightssnowshowersandthunder_day', 'lightssnowshowersandthunder_night', 'lightssnowshowersandthunder_polartwilight'
];

// Combined list of all symbols
const allSymbols = [...weatherSymbols, ...specialCases];

// Base URL for Met.no weather icons
const baseUrl = 'https://raw.githubusercontent.com/metno/weathericons/main/svg/';

// Download all icons
let completed = 0;
const total = allSymbols.length;

// Function to download a file
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(destPath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 404) {
        console.warn(`File not found: ${url}`);
        resolve(); // Continue even if file is not found
      } else {
        reject(`Failed to download ${url}, status code: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Process each symbol
async function processSymbols() {
  console.log(`Downloading ${total} weather icons...`);

  for (const symbol of allSymbols) {
    // For special cases, use the corrected name for the local file but the typo for the URL
    let urlSymbol = symbol;
    let destSymbol = symbol;

    // Handle special cases
    if (symbol.includes('lightssleet')) {
      // For URL use typo version, for destination file use correct name
      urlSymbol = symbol; // With typo
      destSymbol = symbol.replace('lightssleet', 'lightsleet'); // Correct name
    } else if (symbol.includes('lightssnow')) {
      urlSymbol = symbol; // With typo
      destSymbol = symbol.replace('lightssnow', 'lightsnow'); // Correct name
    }

    const url = `${baseUrl}${urlSymbol}.svg`;
    const destPath = path.join(iconsDir, `${destSymbol}.svg`);

    try {
      await downloadFile(url, destPath);
      completed++;
      console.log(`[${completed}/${total}] Downloaded: ${destSymbol}.svg`);
    } catch (error) {
      console.error(`Error downloading ${symbol}:`, error);
    }
  }

  console.log(`Download complete! ${completed} icons saved to ${iconsDir}`);
}

processSymbols();
