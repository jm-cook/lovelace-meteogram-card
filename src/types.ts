// Define the configuration interface for the card
export interface MeteogramCardConfig {
    title?: string;
    latitude?: number;
    longitude?: number;
    show_cloud_cover?: boolean;
    show_pressure?: boolean;
    show_weather_icons?: boolean;
    show_wind?: boolean;
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
  pressure: number[]; // Add pressure to match the actual data structure
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
        air_pressure_at_sea_level?: number; // Add pressure field
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
  checked?: boolean; // Add the checked property for switches
}

// Define editor interface with required methods
export interface MeteogramCardEditorElement extends HTMLElement {
  setConfig(config: MeteogramCardConfig): void;
  hass?: any;
  config?: MeteogramCardConfig;
}
