export interface Location {
  lat: number
  lng: number
  name?: string
}

export interface WeatherUnit {
  temperature: 'celsius' | 'fahrenheit'
  windspeed: 'kmh' | 'mph'
  precipitation: 'mm' | 'inch'
}

export interface HourlyWeather {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
  windspeed_10m: number[]
  winddirection_10m: number[]
  weather_code: number[]
}

export interface DailyWeather {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  sunrise: string[]
  sunset: string[]
  precipitation_sum: number[]
  windspeed_10m_max: number[]
  winddirection_10m_dominant: number[]
  uv_index_max: number[]
}

export interface CurrentWeather {
  time: string
  interval: number
  temperature_2m: number
  windspeed_10m: number
  winddirection_10m: number
  weather_code: number
  relative_humidity_2m?: number
  surface_pressure?: number
  visibility?: number
  cloud_cover?: number
}

export interface WeatherApiResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current: CurrentWeather
  current_units: Record<string, string>
  hourly: HourlyWeather
  hourly_units: Record<string, string>
  daily: DailyWeather
  daily_units: Record<string, string>
}

export interface ProcessedHourlyData {
  time: Date
  temperature: number
  precipitation: number
  windSpeed: number
  windDirection: number
  weatherCode: number
}

export interface ProcessedDailyData {
  date: Date
  weatherCode: number
  tempMax: number
  tempMin: number
  sunrise: Date
  sunset: Date
  precipitation: number
  windSpeed: number
  windDirection: number
  uvIndex: number
}

export interface WeatherCondition {
  code: number
  description: string
  icon: string
  isDay: boolean
}

// Weather icon mapping using @bybas/weather-icons (Meteocons)
export const WEATHER_CODES: Record<number, { description: string; day_icon: string; night_icon: string }> = {
  0: { description: 'Clear sky', day_icon: 'clear-day', night_icon: 'clear-night' },
  1: { description: 'Mainly clear', day_icon: 'partly-cloudy-day', night_icon: 'partly-cloudy-night' },
  2: { description: 'Partly cloudy', day_icon: 'partly-cloudy-day', night_icon: 'partly-cloudy-night' },
  3: { description: 'Overcast', day_icon: 'cloudy', night_icon: 'cloudy' },
  45: { description: 'Fog', day_icon: 'fog-day', night_icon: 'fog-night' },
  48: { description: 'Depositing rime fog', day_icon: 'fog-day', night_icon: 'fog-night' },
  51: { description: 'Light drizzle', day_icon: 'partly-cloudy-day-drizzle', night_icon: 'partly-cloudy-night-drizzle' },
  53: { description: 'Moderate drizzle', day_icon: 'drizzle', night_icon: 'drizzle' },
  55: { description: 'Dense drizzle', day_icon: 'drizzle', night_icon: 'drizzle' },
  56: { description: 'Light freezing drizzle', day_icon: 'partly-cloudy-day-sleet', night_icon: 'partly-cloudy-night-sleet' },
  57: { description: 'Dense freezing drizzle', day_icon: 'sleet', night_icon: 'sleet' },
  61: { description: 'Slight rain', day_icon: 'partly-cloudy-day-rain', night_icon: 'partly-cloudy-night-rain' },
  63: { description: 'Moderate rain', day_icon: 'rain', night_icon: 'rain' },
  65: { description: 'Heavy rain', day_icon: 'rain', night_icon: 'rain' },
  66: { description: 'Light freezing rain', day_icon: 'partly-cloudy-day-sleet', night_icon: 'partly-cloudy-night-sleet' },
  67: { description: 'Heavy freezing rain', day_icon: 'sleet', night_icon: 'sleet' },
  71: { description: 'Slight snow fall', day_icon: 'partly-cloudy-day-snow', night_icon: 'partly-cloudy-night-snow' },
  73: { description: 'Moderate snow fall', day_icon: 'snow', night_icon: 'snow' },
  75: { description: 'Heavy snow fall', day_icon: 'snow', night_icon: 'snow' },
  77: { description: 'Snow grains', day_icon: 'snow', night_icon: 'snow' },
  80: { description: 'Slight rain showers', day_icon: 'partly-cloudy-day-rain', night_icon: 'partly-cloudy-night-rain' },
  81: { description: 'Moderate rain showers', day_icon: 'rain', night_icon: 'rain' },
  82: { description: 'Violent rain showers', day_icon: 'thunderstorms-rain', night_icon: 'thunderstorms-rain' },
  85: { description: 'Slight snow showers', day_icon: 'partly-cloudy-day-snow', night_icon: 'partly-cloudy-night-snow' },
  86: { description: 'Heavy snow showers', day_icon: 'snow', night_icon: 'snow' },
  95: { description: 'Thunderstorm', day_icon: 'thunderstorms-day', night_icon: 'thunderstorms-night' },
  96: { description: 'Thunderstorm with slight hail', day_icon: 'thunderstorms-day-hail', night_icon: 'thunderstorms-night-hail' },
  99: { description: 'Thunderstorm with heavy hail', day_icon: 'thunderstorms-day-hail', night_icon: 'thunderstorms-night-hail' }
}