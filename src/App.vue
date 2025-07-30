<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { useWeatherApi } from '@/composables/useWeatherApi'
import CurrentConditions from '@/components/CurrentConditions.vue'
import HourlyChart from '@/components/HourlyChart.vue'
import WeeklyForecast from '@/components/WeeklyForecast.vue'
import PrecipitationGauge from '@/components/PrecipitationGauge.vue'
import WindCompass from '@/components/WindCompass.vue'

const weatherStore = useWeatherStore()
const { initializeWeatherData, cleanup, isLoading, error } = useWeatherApi()

// Local time functionality
const currentTime = ref(new Date())
let timeInterval: number | null = null

const currentLocalTime = computed(() => {
  return currentTime.value.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
})

const currentTimezone = computed(() => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const shortTimezone = currentTime.value.toLocaleDateString('en-US', { 
    timeZoneName: 'short' 
  }).split(', ').pop() || timezone
  return `${timezone} (${shortTimezone})`
})

const formatCoordinates = (lat: number, lng: number): string => {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  const latAbs = Math.abs(lat).toFixed(2)
  const lngAbs = Math.abs(lng).toFixed(2)
  return `${latAbs}°${latDir}, ${lngAbs}°${lngDir}`
}

onMounted(async () => {
  try {
    await weatherStore.initializeLocation()
    await initializeWeatherData()
    
    // Start time updates
    timeInterval = setInterval(() => {
      currentTime.value = new Date()
    }, 60000) // Update every minute
    
    setTimeout(() => {
      weatherStore.setAppInitialized(true)
    }, 500)
  } catch (error) {
    console.error('App initialization failed:', error)
    weatherStore.setAppInitialized(true)
  }
})

onUnmounted(() => {
  cleanup()
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

const toggleTemperatureUnit = () => {
  weatherStore.toggleTemperatureUnit()
}

</script>

<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="!weatherStore.isAppInitialized" class="flex items-center justify-center min-h-screen">
      <div class="text-center glass-panel p-8">
        <div class="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
        <p class="text-slate-300 font-medium">Loading weather data...</p>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div v-else class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <header class="glass-panel p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-slate-100 mb-2">Weather Dashboard</h1>
            
            <!-- Enhanced Location and Time -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <!-- Detailed Location -->
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="text-lg font-semibold text-slate-200">{{ weatherStore.location?.name || 'Loading location...' }}</span>
                <span class="text-sm text-slate-400" v-if="weatherStore.location">
                  ({{ formatCoordinates(weatherStore.location.lat, weatherStore.location.lng) }})
                </span>
              </div>
              
              <!-- Enhanced Time and Timezone -->
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span class="text-lg font-medium text-slate-300">{{ currentLocalTime }}</span>
                <span class="text-sm text-slate-400">{{ currentTimezone }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              @click="toggleTemperatureUnit"
              class="px-4 py-2 text-slate-200 bg-slate-700 hover:bg-slate-600 transition-all duration-200 rounded-lg text-sm font-medium border border-slate-600"
            >
              {{ weatherStore.units.temperature === 'celsius' ? '°C' : '°F' }}
            </button>
            
            <button 
              @click="initializeWeatherData" 
              :disabled="isLoading"
              class="px-4 py-2 text-slate-100 bg-blue-600 hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 rounded-lg border border-blue-500"
            >
              <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Error Message -->
      <div v-if="error" class="glass-panel p-4 mb-6 border-l-4 border-red-500">
        <p class="text-red-400">{{ error }}</p>
      </div>

      <!-- Dashboard Layout -->
      <div class="grid grid-cols-1 gap-5 mb-5">
        <!-- Current Weather - Full width -->
        <div>
          <CurrentConditions />
        </div>
      </div>

      <!-- Temperature Forecast - Full width -->
      <div class="mb-5">
        <HourlyChart />
      </div>

      <!-- Rain and Wind Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <PrecipitationGauge />
        <WindCompass />
      </div>

      <!-- Weekly Forecast - Full width -->
      <WeeklyForecast />
    </div>
  </div>
</template>

<style scoped>
/* Clean, minimal styles */
</style>
