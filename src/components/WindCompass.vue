<template>
  <div class="glass-panel p-5">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <WeatherIcon icon="windsock" size="1.8rem" :interactive="true" :animated="true" />
        <h3 class="text-lg font-semibold text-slate-100">Wind</h3>
      </div>
      <div class="text-2xl font-bold text-emerald-400">{{ Math.round(windSpeed) }} {{ windSpeedUnit }}</div>
    </div>

    <div class="mb-4">
      <div class="text-slate-400 text-sm mb-2">{{ getWindCategory(windSpeed) }}</div>
      <div class="flex items-center justify-center">
        <div class="relative w-16 h-16 rounded-full border-2 border-slate-600 bg-slate-800">
          <div 
            class="absolute w-1 h-6 bg-emerald-400 rounded-full transition-transform duration-300"
            :style="{ 
              transform: `translate(-50%, -50%) rotate(${windDirection}deg)`,
              left: '50%',
              top: '25%',
              transformOrigin: '50% 150%'
            }"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="text-center">
        <div class="text-slate-400 text-xs font-medium mb-1">Direction</div>
        <div class="text-slate-100 font-bold">{{ getShortDirection() }}</div>
      </div>
      <div class="text-center">
        <div class="text-slate-400 text-xs font-medium mb-1">Degrees</div>
        <div class="text-slate-100 font-bold">{{ Math.round(windDirection) }}°</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import WeatherIcon from '@/components/WeatherIcon.vue'

const weatherStore = useWeatherStore()

const currentWeather = computed(() => weatherStore.currentWeather)
const windSpeedUnit = computed(() => weatherStore.getWindSpeedUnit())

const windSpeed = computed(() => currentWeather.value?.windSpeed || 0)
const windDirection = computed(() => currentWeather.value?.winddirection_10m || 0)


const getWindCategory = (speed: number): string => {
  if (speed < 1) return 'Calm'
  if (speed < 6) return 'Light air'
  if (speed < 12) return 'Light breeze'
  if (speed < 20) return 'Gentle breeze'
  if (speed < 29) return 'Moderate breeze'
  if (speed < 39) return 'Fresh breeze'
  if (speed < 50) return 'Strong breeze'
  return 'High wind'
}

const getShortDirection = (): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(windDirection.value / 22.5) % 16
  return directions[index]
}
</script>

<style scoped>
/* Clean, minimal styles */
</style>