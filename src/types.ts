export interface MeteogramCardConfig {
  type: string;
  title?: string;
  latitude?: number;
  longitude?: number;
}

export interface MeteogramData {
  time: Date[];
  temperature: (number | null)[];
  rain: number[];
  snow: number[];
  cloudCover: number[];
  windSpeed: number[];
  windDirection: number[];
  symbolCode: string[];
}

export interface WeatherDataPoint {
  time: string;
  data: {
    instant: {
      details: {
        air_temperature?: number;
        cloud_area_fraction?: number;
        wind_speed?: number;
        wind_from_direction?: number;
      }
    };
    next_1_hours?: {
      details?: {
        precipitation_amount?: number;
      };
      summary?: {
        symbol_code?: string;
      };
    };
    next_6_hours?: {
      details?: {
        precipitation_amount?: number;
      };
      summary?: {
        symbol_code?: string;
      };
    };
  };
}

// For day boundary shading
export interface DayRange {
  start: number;
  end: number;
}

// Define a custom type for inputs that need configValue property
export interface ConfigurableHTMLElement extends HTMLElement {
  configValue?: string;
  value?: string | number;
}
