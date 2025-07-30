import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  Location, 
  WeatherUnit, 
  WeatherApiResponse, 
  ProcessedHourlyData, 
  ProcessedDailyData,
  WeatherCondition
} from '@/types/weather'
import { WEATHER_CODES } from '@/types/weather'

export const useWeatherStore = defineStore('weather', () => {
  // State
  const location = ref<Location | null>(null)
  const isLocationLoading = ref(true)
  const isAppInitialized = ref(false)
  
  const units = ref<WeatherUnit>({
    temperature: 'celsius',
    windspeed: 'kmh',
    precipitation: 'mm'
  })

  const weatherData = ref<WeatherApiResponse | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  // Getters
  const currentWeather = computed(() => {
    if (!weatherData.value?.current || !location.value) return null
    
    const current = weatherData.value.current
    const isDay = isCurrentlyDay()
    
    return {
      ...current,
      condition: getWeatherCondition(current.weather_code, isDay),
      temperature: convertTemperature(current.temperature_2m),
      windSpeed: convertWindSpeed(current.windspeed_10m)
    }
  })

  const hourlyData = computed((): ProcessedHourlyData[] => {
    if (!weatherData.value?.hourly) return []
    
    const hourly = weatherData.value.hourly
    const now = new Date()
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    return hourly.time
      .map((time, index) => ({
        time: new Date(time),
        temperature: convertTemperature(hourly.temperature_2m[index]),
        precipitation: hourly.precipitation_probability[index],
        windSpeed: convertWindSpeed(hourly.windspeed_10m[index]),
        windDirection: hourly.winddirection_10m[index],
        weatherCode: hourly.weather_code[index]
      }))
      .filter(item => item.time >= now && item.time <= next24Hours)
  })

  const dailyData = computed((): ProcessedDailyData[] => {
    if (!weatherData.value?.daily) return []
    
    const daily = weatherData.value.daily
    
    return daily.time.map((date, index) => ({
      date: new Date(date),
      weatherCode: daily.weather_code[index],
      tempMax: convertTemperature(daily.temperature_2m_max[index]),
      tempMin: convertTemperature(daily.temperature_2m_min[index]),
      sunrise: new Date(daily.sunrise[index]),
      sunset: new Date(daily.sunset[index]),
      precipitation: daily.precipitation_sum[index],
      windSpeed: convertWindSpeed(daily.windspeed_10m_max[index]),
      windDirection: daily.winddirection_10m_dominant[index],
      uvIndex: daily.uv_index_max ? daily.uv_index_max[index] || 0 : 0
    }))
  })

  const temperatureRange = computed(() => {
    if (!dailyData.value.length) return { min: 0, max: 30 }
    
    const temps = dailyData.value.flatMap(day => [day.tempMin, day.tempMax])
    return {
      min: Math.floor(Math.min(...temps)) - 2,
      max: Math.ceil(Math.max(...temps)) + 2
    }
  })

  const isDaytime = computed(() => {
    if (!currentWeather.value || !dailyData.value.length) return true
    
    const now = new Date()
    const today = dailyData.value[0]
    
    return now >= today.sunrise && now <= today.sunset
  })

  const backgroundGradient = computed(() => {
    if (!currentWeather.value) return 'from-cyan-400 via-teal-500 to-blue-600'
    
    // Always use Celsius for consistent color scaling regardless of display unit
    const tempCelsius = units.value.temperature === 'celsius' 
      ? currentWeather.value.temperature 
      : (currentWeather.value.temperature - 32) * 5/9
    const isDay = isDaytime.value
    
    if (tempCelsius < 0) {
      // Arctic blue-teal palette
      return isDay 
        ? 'from-cyan-200 via-cyan-400 to-teal-600' 
        : 'from-slate-900 via-cyan-900 to-teal-900'
    } else if (tempCelsius < 15) {
      // Cool teal-blue palette
      return isDay 
        ? 'from-teal-300 via-cyan-400 to-blue-500' 
        : 'from-slate-800 via-teal-800 to-cyan-900'
    } else if (tempCelsius < 25) {
      // Moderate teal-orange palette
      return isDay 
        ? 'from-teal-400 via-emerald-400 to-orange-400' 
        : 'from-slate-700 via-teal-700 to-orange-800'
    } else {
      // Warm orange-red palette (Kurzgesagt signature)
      return isDay 
        ? 'from-orange-300 via-orange-400 to-red-500' 
        : 'from-orange-900 via-red-800 to-purple-900'
    }
  })

  // Actions
  const setLocation = (newLocation: Location) => {
    location.value = newLocation
  }

  const getUserLocation = (): Promise<Location> => {
    return new Promise((resolve, _reject) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported, using Berlin')
        resolve({
          lat: 52.52,
          lng: 13.41,
          name: 'Berlin'
        })
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            
            // Get city name and country using reverse geocoding
            const locationData = await reverseGeocode(lat, lng)
            
            // Set temperature unit based on country
            setTemperatureUnitByCountry(locationData.countryCode)
            
            resolve({
              lat,
              lng,
              name: locationData.cityName
            })
          } catch (error) {
            console.warn('Reverse geocoding failed, using coordinates:', error)
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              name: 'Your Location'
            })
          }
        },
        (error) => {
          console.warn('Geolocation failed, using default location:', error)
          // Fallback to Berlin
          resolve({
            lat: 52.52,
            lng: 13.41,
            name: 'Berlin'
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  const initializeLocation = async () => {
    try {
      isLocationLoading.value = true
      const userLocation = await getUserLocation()
      location.value = userLocation
    } catch (error) {
      console.error('Failed to get location:', error)
      // Ultimate fallback
      location.value = {
        lat: 52.52,
        lng: 13.41,
        name: 'Berlin'
      }
    } finally {
      isLocationLoading.value = false
    }
  }

  const setAppInitialized = (initialized: boolean) => {
    isAppInitialized.value = initialized
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<{cityName: string, countryCode: string}> => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Vue-Weather-App/1.0'
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Geocoding request failed')
      }
      
      const data = await response.json()
      const address = data.address || {}
      
      // Extract city name (try multiple possible fields)
      const cityName = address.city || 
                      address.town || 
                      address.village || 
                      address.municipality || 
                      address.county || 
                      data.display_name?.split(',')[0] || 
                      'Unknown Location'
      
      const countryCode = address.country_code?.toUpperCase() || 'US'
      
      return { cityName, countryCode }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error)
      return { cityName: 'Your Location', countryCode: 'US' }
    }
  }

  const setTemperatureUnitByCountry = (countryCode: string) => {
    // Countries that primarily use Fahrenheit
    const fahrenheitCountries = ['US', 'LR', 'MM'] // USA, Liberia, Myanmar
    
    if (fahrenheitCountries.includes(countryCode)) {
      units.value.temperature = 'fahrenheit'
    } else {
      units.value.temperature = 'celsius'
    }
  }

  const toggleTemperatureUnit = () => {
    units.value.temperature = units.value.temperature === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  const setWeatherData = (data: WeatherApiResponse) => {
    weatherData.value = data
    lastUpdated.value = new Date()
    error.value = null
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string) => {
    error.value = errorMessage
    isLoading.value = false
  }

  const clearError = () => {
    error.value = null
  }

  // Helper functions
  const convertTemperature = (celsius: number): number => {
    if (units.value.temperature === 'fahrenheit') {
      return Math.round((celsius * 9/5) + 32)
    }
    return Math.round(celsius)
  }

  const convertWindSpeed = (kmh: number): number => {
    if (units.value.windspeed === 'mph') {
      return Math.round(kmh * 0.621371)
    }
    return Math.round(kmh)
  }

  const getWeatherCondition = (code: number, isDay: boolean): WeatherCondition => {
    const weatherInfo = (WEATHER_CODES as any)[code] || WEATHER_CODES[0]
    return {
      code,
      description: weatherInfo.description,
      icon: isDay ? weatherInfo.day_icon : weatherInfo.night_icon,
      isDay
    }
  }

  const isCurrentlyDay = (): boolean => {
    if (!weatherData.value?.daily) return true
    
    const now = new Date()
    const today = weatherData.value.daily
    const todaySunrise = new Date(today.sunrise[0])
    const todaySunset = new Date(today.sunset[0])
    
    return now >= todaySunrise && now <= todaySunset
  }

  const getTemperatureUnit = () => {
    return units.value.temperature === 'celsius' ? '°C' : '°F'
  }

  const getWindSpeedUnit = () => {
    return units.value.windspeed === 'kmh' ? 'km/h' : 'mph'
  }

  return {
    // State
    location,
    isLocationLoading,
    isAppInitialized,
    units,
    weatherData,
    isLoading,
    error,
    lastUpdated,
    
    // Getters
    currentWeather,
    hourlyData,
    dailyData,
    temperatureRange,
    isDaytime,
    backgroundGradient,
    
    // Actions
    setLocation,
    getUserLocation,
    initializeLocation,
    setAppInitialized,
    toggleTemperatureUnit,
    setWeatherData,
    setLoading,
    setError,
    clearError,
    
    // Helpers
    getTemperatureUnit,
    getWindSpeedUnit,
    getWeatherCondition
  }
})