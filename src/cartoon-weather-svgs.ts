/**
 * Cartoon Weather SVG Icons
 * 
 * Hand-coded SVG illustrations for weather conditions
 * in a cheerful cartoon style
 */

export const CartoonWeatherSVGs = {
  sunny: `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Sky gradient -->
      <defs>
        <radialGradient id="skyGradient" cx="50%" cy="30%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#4169E1;stop-opacity:1" />
        </radialGradient>
        <radialGradient id="sunGradient" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="70%" style="stop-color:#FFA500;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
        </radialGradient>
      </defs>
      
      <!-- Sky background -->
      <rect width="200" height="200" fill="url(#skyGradient)" rx="20"/>
      
      <!-- Sun rays -->
      <g stroke="#FFD700" stroke-width="3" stroke-linecap="round">
        <line x1="100" y1="20" x2="100" y2="35" />
        <line x1="100" y1="165" x2="100" y2="180" />
        <line x1="20" y1="100" x2="35" y2="100" />
        <line x1="165" y1="100" x2="180" y2="100" />
        <line x1="41.5" y1="41.5" x2="52.2" y2="52.2" />
        <line x1="147.8" y1="147.8" x2="158.5" y2="158.5" />
        <line x1="158.5" y1="41.5" x2="147.8" y2="52.2" />
        <line x1="52.2" y1="147.8" x2="41.5" y2="158.5" />
      </g>
      
      <!-- Sun face -->
      <circle cx="100" cy="100" r="35" fill="url(#sunGradient)" stroke="#FFA500" stroke-width="2"/>
      
      <!-- Sun eyes -->
      <circle cx="88" cy="88" r="4" fill="#FF8C00"/>
      <circle cx="112" cy="88" r="4" fill="#FF8C00"/>
      
      <!-- Sun smile -->
      <path d="M 85 110 Q 100 125 115 110" stroke="#FF8C00" stroke-width="3" fill="none" stroke-linecap="round"/>
      
      <!-- Fluffy clouds -->
      <g fill="#FFFFFF" opacity="0.9">
        <circle cx="60" cy="160" r="12"/>
        <circle cx="72" cy="158" r="15"/>
        <circle cx="85" cy="160" r="10"/>
        
        <circle cx="140" cy="50" r="8"/>
        <circle cx="150" cy="48" r="12"/>
        <circle cx="160" cy="50" r="9"/>
      </g>
    </svg>
  `,

  rainy: `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stormySky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#708090;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2F4F4F;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="cloudGradient" cx="50%" cy="30%">
          <stop offset="0%" style="stop-color:#D3D3D3;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#696969;stop-opacity:1" />
        </radialGradient>
      </defs>
      
      <!-- Stormy sky -->
      <rect width="200" height="200" fill="url(#stormySky)" rx="20"/>
      
      <!-- Rain cloud -->
      <g fill="url(#cloudGradient)">
        <circle cx="100" cy="80" r="30"/>
        <circle cx="75" cy="85" r="25"/>
        <circle cx="125" cy="85" r="25"/>
        <circle cx="85" cy="100" r="20"/>
        <circle cx="115" cy="100" r="20"/>
      </g>
      
      <!-- Cloud face -->
      <circle cx="90" cy="75" r="3" fill="#4F4F4F"/>
      <circle cx="110" cy="75" r="3" fill="#4F4F4F"/>
      <path d="M 85 90 Q 100 80 115 90" stroke="#4F4F4F" stroke-width="2" fill="none"/>
      
      <!-- Rain drops -->
      <g fill="#4169E1" opacity="0.7">
        <ellipse cx="70" cy="130" rx="3" ry="8"/>
        <ellipse cx="85" cy="145" rx="3" ry="8"/>
        <ellipse cx="100" cy="135" rx="3" ry="8"/>
        <ellipse cx="115" cy="150" rx="3" ry="8"/>
        <ellipse cx="130" cy="140" rx="3" ry="8"/>
        
        <ellipse cx="75" cy="160" rx="2" ry="6"/>
        <ellipse cx="95" cy="170" rx="2" ry="6"/>
        <ellipse cx="110" cy="165" rx="2" ry="6"/>
        <ellipse cx="125" cy="175" rx="2" ry="6"/>
      </g>
    </svg>
  `,

  cloudy: `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="overcastSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#B0C4DE;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#778899;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="grayCloud" cx="40%" cy="40%">
          <stop offset="0%" style="stop-color:#F5F5F5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#DCDCDC;stop-opacity:1" />
        </radialGradient>
      </defs>
      
      <!-- Cloudy sky -->
      <rect width="200" height="200" fill="url(#overcastSky)" rx="20"/>
      
      <!-- Multiple clouds -->
      <g fill="url(#grayCloud)">
        <!-- Main cloud -->
        <circle cx="100" cy="90" r="35"/>
        <circle cx="70" cy="100" r="30"/>
        <circle cx="130" cy="100" r="30"/>
        <circle cx="85" cy="120" r="25"/>
        <circle cx="115" cy="120" r="25"/>
        
        <!-- Background clouds -->
        <circle cx="50" cy="60" r="20" opacity="0.7"/>
        <circle cx="35" cy="70" r="15" opacity="0.7"/>
        <circle cx="65" cy="65" r="18" opacity="0.7"/>
        
        <circle cx="150" cy="50" r="18" opacity="0.6"/>
        <circle cx="170" cy="60" r="15" opacity="0.6"/>
        <circle cx="135" cy="55" r="12" opacity="0.6"/>
      </g>
      
      <!-- Main cloud face -->
      <circle cx="85" cy="85" r="4" fill="#A9A9A9"/>
      <circle cx="115" cy="85" r="4" fill="#A9A9A9"/>
      <path d="M 90 105 Q 100 95 110 105" stroke="#A9A9A9" stroke-width="3" fill="none"/>
    </svg>
  `,

  partlyCloudy: `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="partlyCloudySky" cx="60%" cy="40%">
          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
        </radialGradient>
        <radialGradient id="partialSun" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
        </radialGradient>
      </defs>
      
      <!-- Sky -->
      <rect width="200" height="200" fill="url(#partlyCloudySky)" rx="20"/>
      
      <!-- Sun (partially hidden) -->
      <g>
        <!-- Sun rays (visible) -->
        <g stroke="#FFD700" stroke-width="2" stroke-linecap="round">
          <line x1="140" y1="30" x2="140" y2="45" />
          <line x1="180" y1="70" x2="165" y2="70" />
          <line x1="165" y1="45" x2="155" y2="55" />
          <line x1="165" y1="95" x2="155" y2="85" />
        </g>
        
        <!-- Sun face (partially visible) -->
        <circle cx="140" cy="70" r="25" fill="url(#partialSun)"/>
        <circle cx="150" cy="60" r="2" fill="#FF8C00"/>
        <circle cx="150" cy="70" r="2" fill="#FF8C00"/>
        <path d="M 145 80 Q 150 85 155 80" stroke="#FF8C00" stroke-width="2" fill="none"/>
      </g>
      
      <!-- Fluffy white cloud -->
      <g fill="#FFFFFF">
        <circle cx="80" cy="100" r="30"/>
        <circle cx="55" cy="110" r="25"/>
        <circle cx="105" cy="110" r="25"/>
        <circle cx="70" cy="130" r="20"/>
        <circle cx="90" cy="130" r="20"/>
      </g>
      
      <!-- Cloud face -->
      <circle cx="70" cy="95" r="3" fill="#D3D3D3"/>
      <circle cx="90" cy="95" r="3" fill="#D3D3D3"/>
      <path d="M 75 115 Q 80 120 85 115" stroke="#D3D3D3" stroke-width="2" fill="none"/>
    </svg>
  `
};

/**
 * Generate CSS background using cartoon SVG
 */
export function getCartoonWeatherBackground(condition: string): string {
  const svgContent = CartoonWeatherSVGs[condition as keyof typeof CartoonWeatherSVGs] || CartoonWeatherSVGs.sunny;
  const encodedSvg = encodeURIComponent(svgContent);
  return `url("data:image/svg+xml,${encodedSvg}")`;
}

/**
 * Get cartoon weather icon as HTML
 */
export function getCartoonWeatherIcon(condition: string, size: number = 100): string {
  const svg = CartoonWeatherSVGs[condition as keyof typeof CartoonWeatherSVGs] || CartoonWeatherSVGs.sunny;
  return svg.replace('viewBox="0 0 200 200"', `viewBox="0 0 200 200" width="${size}" height="${size}"`);
}