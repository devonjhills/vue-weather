<template>
  <div class="glass-panel p-6">
    <!-- Main Weather Section -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-6">
      <!-- Temperature Display -->
      <div class="flex flex-col">
        <div class="flex items-baseline mb-2">
          <span class="text-6xl font-light text-slate-100 tracking-tight">{{ currentWeather?.temperature || '--' }}</span>
          <span class="text-2xl text-slate-300 ml-2 font-medium">{{ temperatureUnit }}</span>
        </div>
        <div class="text-lg font-medium text-slate-200 capitalize mb-1">
          {{ currentWeather?.condition?.description || 'Loading...' }}
        </div>
        <div class="text-slate-400 text-sm">
          <span>{{ getTodaysHigh() }}° / {{ getTodaysLow() }}°</span>
        </div>
      </div>
      
      <!-- Main Weather Icon -->
      <div class="flex-shrink-0">
        <WeatherIcon 
          :icon="getWeatherIcon(currentWeather?.weather_code || 0)" 
          :is-day="isDay" 
          :weather-code="currentWeather?.weather_code || 0" 
          size="7rem"
          :animated="true"
          :interactive="true"
        />
      </div>

      <!-- Key Weather Stats Grid - Now inline -->
      <div class="flex-1 grid grid-cols-2 gap-3 min-w-0">
        <div class="weather-stat">
          <div class="flex items-center h-full">
            <!-- Icon Half -->
            <div class="flex-1 flex items-center justify-center">
              <WeatherIcon icon="wind" size="2.5rem" :interactive="true" :animated="true" />
            </div>
            <!-- Info Half -->
            <div class="flex-1 text-right">
              <div class="text-slate-300 font-medium text-xs mb-1">Wind</div>
              <div class="text-slate-100 font-bold text-sm">{{ getWindDirection(currentWeather?.winddirection_10m || 0) }}</div>
              <div class="text-slate-400 text-xs">{{ currentWeather?.windSpeed || '--' }} {{ windSpeedUnit }}</div>
            </div>
          </div>
        </div>
        
        <div class="weather-stat">
          <div class="flex items-center h-full">
            <!-- Icon Half -->
            <div class="flex-1 flex items-center justify-center">
              <WeatherIcon icon="humidity" size="2.5rem" :interactive="true" :animated="true" />
            </div>
            <!-- Info Half -->
            <div class="flex-1 text-right">
              <div class="text-slate-300 font-medium text-xs mb-1">Humidity</div>
              <div class="text-slate-100 font-bold text-sm">{{ currentWeather?.relative_humidity_2m || '--' }}%</div>
            </div>
          </div>
        </div>
        
        <div class="weather-stat">
          <div class="flex items-center h-full">
            <!-- Icon Half -->
            <div class="flex-1 flex items-center justify-center">
              <WeatherIcon icon="barometer" size="2.5rem" :interactive="true" :animated="true" />
            </div>
            <!-- Info Half -->
            <div class="flex-1 text-right">
              <div class="text-slate-300 font-medium text-xs mb-1">Pressure</div>
              <div class="text-slate-100 font-bold text-sm">{{ Math.round(currentWeather?.surface_pressure || 0) }}</div>
              <div class="text-slate-400 text-xs">hPa</div>
            </div>
          </div>
        </div>
        
        <div class="weather-stat">
          <div class="flex items-center h-full">
            <!-- Icon Half -->
            <div class="flex-1 flex items-center justify-center">
              <WeatherIcon icon="fog" size="2.5rem" :interactive="true" :animated="true" />
            </div>
            <!-- Info Half -->
            <div class="flex-1 text-right">
              <div class="text-slate-300 font-medium text-xs mb-1">Visibility</div>
              <div class="text-slate-100 font-bold text-sm">{{ Math.round((currentWeather?.visibility || 0) / 1000) }}</div>
              <div class="text-slate-400 text-xs">km</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Extended Weather Details -->
    <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
      <div class="metric-card py-4">
        <div class="flex items-center h-full">
          <!-- Icon Half -->
          <div class="flex-1 flex items-center justify-center">
            <WeatherIcon :icon="getPressureIcon(currentWeather?.surface_pressure || 0)" size="2.5rem" :interactive="true" :animated="true" />
          </div>
          <!-- Info Half -->
          <div class="flex-1 text-right">
            <div class="text-slate-300 text-xs font-medium mb-1">Pressure</div>
            <div class="text-sm font-bold text-slate-100">{{ Math.round(currentWeather?.surface_pressure || 0) }}</div>
            <div class="text-xs text-slate-400">hPa</div>
          </div>
        </div>
      </div>
      
      <div class="metric-card py-4">
        <div class="flex items-center h-full">
          <!-- Icon Half -->
          <div class="flex-1 flex items-center justify-center">
            <WeatherIcon icon="cloudy" size="2.5rem" :interactive="true" :animated="true" />
          </div>
          <!-- Info Half -->
          <div class="flex-1 text-right">
            <div class="text-slate-300 text-xs font-medium mb-1">Cloud Cover</div>
            <div class="text-sm font-bold text-slate-100">{{ currentWeather?.cloud_cover != null ? Math.round(currentWeather.cloud_cover) : '--' }}%</div>
          </div>
        </div>
      </div>
      
      <div class="metric-card py-4">
        <div class="flex items-center h-full">
          <!-- Icon Half -->
          <div class="flex-1 flex items-center justify-center">
            <WeatherIcon icon="sunrise" size="2.5rem" :interactive="true" :animated="true" />
          </div>
          <!-- Info Half -->
          <div class="flex-1 text-right">
            <div class="text-slate-300 text-xs font-medium mb-1">Sunrise</div>
            <div class="text-sm font-bold text-slate-100">{{ formatTime(getTodaysSunrise()) }}</div>
          </div>
        </div>
      </div>
      
      <div class="metric-card py-4">
        <div class="flex items-center h-full">
          <!-- Icon Half -->
          <div class="flex-1 flex items-center justify-center">
            <WeatherIcon icon="sunset" size="2.5rem" :interactive="true" :animated="true" />
          </div>
          <!-- Info Half -->
          <div class="flex-1 text-right">
            <div class="text-slate-300 text-xs font-medium mb-1">Sunset</div>
            <div class="text-sm font-bold text-slate-100">{{ formatTime(getTodaysSunset()) }}</div>
          </div>
        </div>
      </div>
      
      <div class="metric-card py-4">
        <div class="flex items-center h-full">
          <!-- Icon Half -->
          <div class="flex-1 flex items-center justify-center">
            <WeatherIcon :icon="getUVIcon(getTodaysUV())" size="2.5rem" :interactive="true" :animated="true" />
          </div>
          <!-- Info Half -->
          <div class="flex-1 text-right">
            <div class="text-slate-300 text-xs font-medium mb-1">UV Index</div>
            <div class="text-sm font-bold text-slate-100">{{ getTodaysUV() }}</div>
            <div class="text-xs text-slate-400">{{ getUVDescription(getTodaysUV()) }}</div>
          </div>
        </div>
      </div>
      
      <div class="metric-card py-4">
        <div class="flex items-center h-full">
          <!-- Icon Half -->
          <div class="flex-1 flex items-center justify-center">
            <WeatherIcon icon="thermometer" size="2.5rem" :interactive="true" :animated="true" />
          </div>
          <!-- Info Half -->
          <div class="flex-1 text-right">
            <div class="text-slate-300 text-xs font-medium mb-1">Updated</div>
            <div class="text-xs font-bold text-slate-100">{{ lastUpdatedText }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { WEATHER_CODES } from '@/types/weather'
import WeatherIcon from '@/components/WeatherIcon.vue'

const weatherStore = useWeatherStore()

const currentWeather = computed(() => weatherStore.currentWeather)
const temperatureUnit = computed(() => weatherStore.getTemperatureUnit())
const windSpeedUnit = computed(() => weatherStore.getWindSpeedUnit())

const lastUpdatedText = computed(() => {
  if (!weatherStore.lastUpdated) return 'Never'
  
  const now = new Date()
  const diff = now.getTime() - weatherStore.lastUpdated.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  return weatherStore.lastUpdated.toLocaleDateString()
})


const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

const getUVDescription = (uvIndex: number): string => {
  if (uvIndex <= 2) return 'Low'
  if (uvIndex <= 5) return 'Moderate'
  if (uvIndex <= 7) return 'High'
  if (uvIndex <= 10) return 'Very High'
  return 'Extreme'
}

const getTodaysSunrise = (): Date => {
  const todayData = weatherStore.dailyData[0]
  return todayData ? todayData.sunrise : new Date()
}

const getTodaysSunset = (): Date => {
  const todayData = weatherStore.dailyData[0]
  return todayData ? todayData.sunset : new Date()
}

const getTodaysRain = (): number => {
  const todayData = weatherStore.dailyData[0]
  return todayData ? todayData.precipitation : 0
}

const getTodaysUV = (): number => {
  const todayData = weatherStore.dailyData[0]
  if (!todayData || todayData.uvIndex == null || isNaN(todayData.uvIndex)) {
    return 0
  }
  return todayData.uvIndex
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const getUVIcon = (uvIndex: number): string => {
  if (uvIndex <= 0) return 'uv-index-1'
  if (uvIndex <= 2) return 'uv-index-1'
  if (uvIndex <= 3) return 'uv-index-3'
  if (uvIndex <= 5) return 'uv-index-5'
  if (uvIndex <= 7) return 'uv-index-7'
  if (uvIndex <= 10) return 'uv-index-10'
  return 'uv-index-11'
}

const getPressureIcon = (pressure: number): string => {
  if (pressure < 1013) return 'pressure-low'
  return 'pressure-high'
}

const getTodaysHigh = (): number => {
  const todayData = weatherStore.dailyData[0]
  return todayData ? Math.round(todayData.tempMax) : (currentWeather.value?.temperature || 0)
}

const getTodaysLow = (): number => {
  const todayData = weatherStore.dailyData[0]
  return todayData ? Math.round(todayData.tempMin) : (currentWeather.value?.temperature || 0)
}

const isDay = computed(() => {
  const now = new Date()
  const hour = now.getHours()
  return hour >= 6 && hour < 20 // Simple day/night detection
})

const getWeatherIcon = (weatherCode: number): string => {
  const weatherInfo = (WEATHER_CODES as any)[weatherCode]
  if (!weatherInfo) return 'clear-day'
  return isDay.value ? weatherInfo.day_icon : weatherInfo.night_icon
}
</script>

<style scoped>
/* Clean, minimal styles */
</style>