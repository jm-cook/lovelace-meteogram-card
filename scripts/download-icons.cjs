const fs = require('fs');
const path = require('path');
const https = require('https');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// List of Met.no weather symbols
// This is the full list from https://api.met.no/weatherapi/weathericon/2.0/legends
// Note: Some names have extra "s" after "light" - these are typos in the API but must be supported
const weatherSymbols = [
  'clearsky_day', 'clearsky_night', 'clearsky_polartwilight',
  'fair_day', 'fair_night', 'fair_polartwilight',
  'partlycloudy_day', 'partlycloudy_night', 'partlycloudy_polartwilight',
  'cloudy',
  'rainshowers_day', 'rainshowers_night', 'rainshowers_polartwilight',
  'rainshowersandthunder_day', 'rainshowersandthunder_night', 'rainshowersandthunder_polartwilight',
  'sleetshowers_day', 'sleetshowers_night', 'sleetshowers_polartwilight',
  'sleetshowersandthunder_day', 'sleetshowersandthunder_night', 'sleetshowersandthunder_polartwilight',
  'snowshowers_day', 'snowshowers_night', 'snowshowers_polartwilight',
  'snowshowersandthunder_day', 'snowshowersandthunder_night', 'snowshowersandthunder_polartwilight',
  'rain',
  'rainandthunder',
  'sleet',
  'sleetandthunder',
  'snow',
  'snowandthunder',
  'fog',
  'heavyrain',
  'heavyrainandthunder',
  'heavysleet',
  'heavysleetandthunder',
  'heavysnow',
  'heavysnowandthunder',
  'lightrainshowers_day', 'lightrainshowers_night', 'lightrainshowers_polartwilight',
  'lightrainshowersandthunder_day', 'lightrainshowersandthunder_night', 'lightrainshowersandthunder_polartwilight',
  'lightrain',
  'lightrainandthunder',
  'lightsleetshowers_day', 'lightsleetshowers_night', 'lightsleetshowers_polartwilight',
  'lightsleetshowersandthunder_day', 'lightsleetshowersandthunder_night', 'lightsleetshowersandthunder_polartwilight',
  'lightsleet',
  'lightsleetandthunder',
  'lightsnowshowers_day', 'lightsnowshowers_night', 'lightsnowshowers_polartwilight',
  'lightsnowshowersandthunder_day', 'lightsnowshowersandthunder_night', 'lightsnowshowersandthunder_polartwilight',
  'lightsnow',
  'lightsnowandthunder',
  // Add the typo versions that are actually used in the API
  'lightssleetshowersandthunder_day', 'lightssleetshowersandthunder_night', 'lightssleetshowersandthunder_polartwilight',
  'lightssnowshowersandthunder_day', 'lightssnowshowersandthunder_night', 'lightssnowshowersandthunder_polartwilight'
];

// Mapping for typos to correct versions (for local file naming)
const symbolNameCorrections = {
  'lightssleetshowersandthunder_day': 'lightsleetshowersandthunder_day',
  'lightssleetshowersandthunder_night': 'lightsleetshowersandthunder_night',
  'lightssleetshowersandthunder_polartwilight': 'lightsleetshowersandthunder_polartwilight',
  'lightssnowshowersandthunder_day': 'lightsnowshowersandthunder_day',
  'lightssnowshowersandthunder_night': 'lightsnowshowersandthunder_night',
  'lightssnowshowersandthunder_polartwilight': 'lightsnowshowersandthunder_polartwilight'
};

// Updated download function with correct repository structure and handling for typos
function downloadIcon(symbol) {
  // Use the corrected name for local file, but original name for download
  const localFileName = symbolNameCorrections[symbol] || symbol;

  // The URL structure for Met.no weather icons
  const url = `https://raw.githubusercontent.com/metno/weathericons/main/weather/svg/${symbol}.svg`;
  const filePath = path.join(iconsDir, `${localFileName}.svg`);

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        // Try fallback to the old path structure if the new one fails
        const fallbackUrl = `https://raw.githubusercontent.com/metno/weathericons/main/weather-symbols-v2/${symbol}.svg`;
        console.log(`Failed with new path. Trying fallback: ${fallbackUrl}`);

        https.get(fallbackUrl, (fallbackResponse) => {
          if (fallbackResponse.statusCode !== 200) {
            reject(new Error(`Failed to download ${symbol}: HTTP ${fallbackResponse.statusCode}`));
            return;
          }

          const file = fs.createWriteStream(filePath);
          fallbackResponse.pipe(file);

          file.on('finish', () => {
            file.close();
            console.log(`Downloaded (fallback): ${symbol}${localFileName !== symbol ? ` (saved as ${localFileName})` : ''}`);
            resolve();
          });

          file.on('error', (err) => {
            fs.unlink(filePath, () => {});
            reject(err);
          });
        }).on('error', (err) => {
          reject(err);
        });

        return;
      }

      const file = fs.createWriteStream(filePath);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${symbol}${localFileName !== symbol ? ` (saved as ${localFileName})` : ''}`);
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });

    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download all icons
async function downloadAllIcons() {
  console.log('Starting download of weather icons...');
  console.log(`Icons will be saved to: ${iconsDir}`);
  console.log('Note: Some symbols have typos in the API (extra "s" after "light") but will be saved with corrected names');

  let successCount = 0;
  let failureCount = 0;

  for (const symbol of weatherSymbols) {
    try {
      await downloadIcon(symbol);
      successCount++;
    } catch (error) {
      console.error(`Error downloading ${symbol}: ${error.message}`);
      failureCount++;
    }
  }

  console.log('\nDownload summary:');
  console.log(`- Successfully downloaded: ${successCount} icons`);
  console.log(`- Failed to download: ${failureCount} icons`);
  console.log(`- Icons location: ${iconsDir}`);

  if (failureCount > 0) {
    console.log('\nSome icons failed to download. You might need to:');
    console.log('1. Check your internet connection');
    console.log('2. Verify the Met.no repository structure has not changed');
    console.log('3. Manually download missing icons from: https://github.com/metno/weathericons');
  }
}

downloadAllIcons();
