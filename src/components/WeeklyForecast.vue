<template>
  <div class="glass-panel p-5">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-xl font-semibold text-slate-100 mb-1">7-Day Forecast</h3>
        <p class="text-slate-400 text-sm">{{ getWeeklySummary() }}</p>
      </div>
      <div class="text-right text-sm">
        <div class="text-slate-400 text-xs font-medium">Average</div>
        <div class="text-slate-100 font-bold">{{ getWeeklyAverage() }}°</div>
      </div>
    </div>

    <!-- Weekly forecast -->
    <div class="space-y-1.5">
      <div 
        v-for="(day, index) in dailyData.slice(0, 7)" 
        :key="index"
        class="flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-slate-800/50"
        :class="{ 'bg-slate-800/30 border border-slate-700': index === 0 }"
      >
        <!-- Day -->
        <div class="flex-1">
          <div class="font-bold text-sm" :class="{ 'text-blue-400': index === 0, 'text-slate-100': index !== 0 }">
            {{ getDayAbbrev(day.date, index) }}
          </div>
          <div class="text-xs" :class="{ 'text-blue-300': index === 0, 'text-slate-400': index !== 0 }">
            {{ formatDate(day.date) }}
          </div>
        </div>
        
        <!-- Weather Icon -->
        <div class="flex-shrink-0 mx-3">
          <WeatherIcon 
            :icon="getWeatherIconName(day.weatherCode, true)" 
            :weather-code="day.weatherCode" 
            size="2.4rem"
            :interactive="true"
            :animated="index === 0"
          />
        </div>
        
        <!-- Precipitation -->
        <div class="flex-shrink-0 w-12 text-center">
          <div class="text-xs text-blue-400 font-medium" v-if="day.precipitation > 0">
            {{ day.precipitation.toFixed(1) }}mm
          </div>
        </div>
        
        <!-- Temperature Range -->
        <div class="flex-shrink-0 flex items-center gap-2 min-w-[70px] justify-end">
          <span class="text-slate-400 text-sm font-medium">{{ Math.round(day.tempMin) }}°</span>
          <span class="text-slate-100 font-bold text-sm">{{ Math.round(day.tempMax) }}°</span>
        </div>
      </div>
    </div>

    <!-- Weekly summary -->
    <div class="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-700 text-sm">
      <div class="metric-card text-center">
        <div class="text-orange-400 mb-1 font-medium text-xs">Warmest</div>
        <div class="text-slate-100 font-bold text-sm">{{ getWarmestDay() }}</div>
      </div>
      <div class="metric-card text-center">
        <div class="text-blue-400 mb-1 font-medium text-xs">Rain Days</div>
        <div class="text-slate-100 font-bold text-sm">{{ getRainyDays() }}</div>
      </div>
      <div class="metric-card text-center">
        <div class="text-emerald-400 mb-1 font-medium text-xs">Driest Day</div>
        <div class="text-slate-100 font-bold text-sm">{{ getDriestDay() }}</div>
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

const dailyData = computed(() => weatherStore.dailyData)
const getWeatherIconName = (weatherCode: number, isDay: boolean): string => {
  const weatherInfo = (WEATHER_CODES as any)[weatherCode]
  if (!weatherInfo) return 'clear-day'
  return isDay ? weatherInfo.day_icon : weatherInfo.night_icon
}

const getWeatherDescription = (weatherCode: number): string => {
  const weatherInfo = (WEATHER_CODES as any)[weatherCode]
  return weatherInfo ? weatherInfo.description : 'Clear sky'
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}


const getDayAbbrev = (date: Date, index: number): string => {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
}

const getWeeklySummary = (): string => {
  const data = dailyData.value.slice(0, 7)
  if (!data.length) return 'Loading...'
  
  const rainyDays = data.filter(day => day.precipitation > 1).length
  const hotDays = data.filter(day => day.tempMax > 25).length
  
  if (rainyDays > 3) return 'Expect frequent rain this week'
  if (hotDays > 4) return 'Hot weather ahead'
  return 'Generally pleasant conditions'
}

const getWeeklyAverage = (): number => {
  const data = dailyData.value.slice(0, 7)
  if (!data.length) return 0
  
  const avgHigh = data.reduce((sum, day) => sum + day.tempMax, 0) / data.length
  return Math.round(avgHigh)
}

const getWarmestDay = (): string => {
  const data = dailyData.value.slice(0, 7)
  if (!data.length) return 'N/A'
  
  const warmest = data.reduce((max, day, index) => 
    day.tempMax > data[max].tempMax ? index : max, 0)
  
  return getDayAbbrev(data[warmest].date, warmest)
}

const getRainyDays = (): number => {
  const data = dailyData.value.slice(0, 7)
  // Check for days with more than 1mm of precipitation (light rain threshold)
  return data.filter(day => day.precipitation > 1).length
}

const getDriestDay = (): string => {
  const data = dailyData.value.slice(0, 7)
  if (!data.length) return 'N/A'
  
  // Find day with least precipitation
  const driest = data.reduce((driestIndex, day, index) => {
    return day.precipitation < data[driestIndex].precipitation ? index : driestIndex
  }, 0)
  
  return getDayAbbrev(data[driest].date, driest)
}
</script>

<style scoped>
/* Clean, minimal styles */
</style>