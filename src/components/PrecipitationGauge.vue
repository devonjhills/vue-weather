<template>
  <div class="glass-panel p-5">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <WeatherIcon icon="raindrops" size="1.8rem" :interactive="true" :animated="true" />
        <h3 class="text-lg font-semibold text-slate-100">Precipitation</h3>
      </div>
      <div class="text-2xl font-bold text-blue-400">{{ currentPrecipitation }}%</div>
    </div>

    <div class="mb-4">
      <div class="text-slate-400 text-sm mb-2">{{ getPrecipitationStatus() }}</div>
      <div class="bg-slate-700 rounded-full h-2 overflow-hidden">
        <div 
          class="bg-blue-400 h-full transition-all duration-300"
          :style="{ width: `${Math.min(currentPrecipitation, 100)}%` }"
        ></div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="text-center">
        <div class="text-slate-400 text-xs font-medium mb-1">Current</div>
        <div class="text-slate-100 font-bold">{{ currentPrecipitation }}%</div>
      </div>
      <div class="text-center">
        <div class="text-slate-400 text-xs font-medium mb-1">Peak (12h)</div>
        <div class="text-slate-100 font-bold">{{ maxPrecipitation }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import WeatherIcon from '@/components/WeatherIcon.vue'

const weatherStore = useWeatherStore()

const hourlyData = computed(() => weatherStore.hourlyData.slice(0, 12))


const currentPrecipitation = computed(() => {
  const data = hourlyData.value
  return data.length > 0 ? data[0].precipitation : 0
})

const maxPrecipitation = computed(() => {
  const data = hourlyData.value
  if (!data.length) return 0
  return Math.max(...data.map(item => item.precipitation))
})


const getPrecipitationStatus = (): string => {
  const level = currentPrecipitation.value
  if (level === 0) return 'No precipitation'
  if (level < 20) return 'Light chance'
  if (level < 50) return 'Moderate chance'
  if (level < 80) return 'High chance'
  return 'Very likely'
}

</script>

<style scoped>
/* Clean, minimal styles */
</style>