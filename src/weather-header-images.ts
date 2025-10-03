/**
 * Weather Header Images
 * 
 * Static weather condition imagery for meteogram card headers.
 * Provides day/night variants for different weather conditions.
 */

// For now, we'll use online placeholder images or simple gradients
// You can replace these with actual weather artwork later

interface WeatherImageVariants {
  day: string;
  night: string;
}

// CSS gradient backgrounds as placeholders - you can replace with actual images
const gradients = {
  sunny: {
    day: "linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #74b9ff 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #636e72 50%, #2d3436 100%)"
  },
  partlycloudy: {
    day: "linear-gradient(135deg, #a29bfe 0%, #74b9ff 50%, #00cec9 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #636e72 30%, #74b9ff 100%)"
  },
  cloudy: {
    day: "linear-gradient(135deg, #ddd 0%, #b2bec3 50%, #636e72 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)"
  },
  rainy: {
    day: "linear-gradient(135deg, #74b9ff 0%, #0984e3 30%, #00b894 70%, #00cec9 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #0984e3 50%, #74b9ff 100%)"
  },
  pouring: {
    day: "linear-gradient(135deg, #0984e3 0%, #74b9ff 30%, #00b894 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #0984e3 100%)"
  },
  snowy: {
    day: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 30%, #74b9ff 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #636e72 50%, #f8f9fa 100%)"
  },
  fog: {
    day: "linear-gradient(135deg, #e9ecef 0%, #ced6e0 50%, #a4b0be 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #57606f 100%)"
  },
  windy: {
    day: "linear-gradient(135deg, #a4b0be 0%, #57606f 30%, #2f3542 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #57606f 100%)"
  },
  lightning: {
    day: "linear-gradient(135deg, #2d3436 0%, #57606f 30%, #ffeaa7 50%, #fdcb6e 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #fdcb6e 70%, #e17055 100%)"
  }
};

export const WeatherHeaderImages: Record<string, WeatherImageVariants> = {
  sunny: gradients.sunny,
  "clear-night": { day: gradients.sunny.day, night: gradients.sunny.night },
  partlycloudy: gradients.partlycloudy,
  cloudy: gradients.cloudy,
  overcast: gradients.cloudy,
  rainy: gradients.rainy,
  pouring: gradients.pouring,
  snowy: gradients.snowy,
  "snowy-rainy": {
    day: "linear-gradient(135deg, #74b9ff 0%, #e9ecef 30%, #00cec9 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #74b9ff 50%, #e9ecef 100%)"
  },
  fog: gradients.fog,
  hail: {
    day: "linear-gradient(135deg, #e9ecef 0%, #74b9ff 50%, #0984e3 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #74b9ff 100%)"
  },
  windy: gradients.windy,
  "windy-variant": gradients.windy,
  lightning: gradients.lightning,
  "lightning-rainy": {
    day: "linear-gradient(135deg, #0984e3 0%, #fdcb6e 50%, #e17055 100%)",
    night: "linear-gradient(135deg, #2d3436 0%, #0984e3 30%, #fdcb6e 70%, #e17055 100%)"
  }
};

export const DEFAULT_WEATHER_IMAGE: WeatherImageVariants = WeatherHeaderImages.partlycloudy;

/**
 * Get weather header background for current conditions
 * @param state Weather condition state (e.g., 'sunny', 'rainy')
 * @param isDaytime Whether it's currently daytime
 * @returns CSS background string (gradient or image URL)
 */
export function getWeatherHeaderBackground(state: string, isDaytime: boolean = true): string {
  const normalizedState = state.replace(/-/g, "").toLowerCase();
  const variants = WeatherHeaderImages[normalizedState] || WeatherHeaderImages[state] || DEFAULT_WEATHER_IMAGE;
  
  return isDaytime ? variants.day : variants.night;
}

/**
 * Determine if it's currently daytime based on weather entity or sun position
 * @param weatherEntity Weather entity from Home Assistant
 * @param coordinates Optional coordinates for sun calculation
 * @returns boolean indicating if it's daytime
 */
export function isDaytimeNow(weatherEntity?: any, _coordinates?: { latitude: number; longitude: number }): boolean {
  // First check if weather entity provides daytime info
  if (weatherEntity?.attributes?.is_daytime !== undefined) {
    return weatherEntity.attributes.is_daytime;
  }
  
  // Fallback to simple time-based check (6 AM to 6 PM)
  // TODO: Use coordinates for more accurate sun position calculation
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}