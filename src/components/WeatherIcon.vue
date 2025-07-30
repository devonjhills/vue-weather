<template>
  <div 
    class="weather-icon" 
    :style="{ width: size, height: size }"
    :class="[
      'transition-all duration-200 ease-out',
      animated && 'animate-float',
      interactive && 'hover:scale-105 cursor-pointer'
    ]"
  >
    <!-- Main icon container -->
    <div 
      v-if="iconSvg" 
      v-html="iconSvg" 
      class="w-full h-full"
    ></div>
    
    <!-- Fallback icon -->
    <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
      <svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" fill="#fbbf24" />
        <g stroke="#f59e0b" stroke-width="2" stroke-linecap="round">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  icon: string
  size?: string
  isDay?: boolean
  weatherCode?: number
  animated?: boolean
  interactive?: boolean
  enhanced?: boolean
  glowing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: '48px',
  isDay: true,
  weatherCode: 0,
  animated: false,
  interactive: false,
  enhanced: true,
  glowing: false
})

// No color overrides - preserve SVG natural colors

const iconSvg = ref<string>('')

// Use line version for better colors
const iconMap: Record<string, () => Promise<any>> = {
  // Test a few basic icons first with line version
  'rain': () => import('@bybas/weather-icons/design/line/animation-ready/rain.svg?raw'),
  'cloudy': () => import('@bybas/weather-icons/design/line/animation-ready/cloudy.svg?raw'),
  'humidity': () => import('@bybas/weather-icons/design/line/animation-ready/humidity.svg?raw'),
  'wind': () => import('@bybas/weather-icons/design/line/animation-ready/wind.svg?raw'),
  
  // All weather icons using line version for better colors
  'clear-day': () => import('@bybas/weather-icons/design/line/animation-ready/clear-day.svg?raw'),
  'clear-night': () => import('@bybas/weather-icons/design/line/animation-ready/clear-night.svg?raw'),
  'partly-cloudy-day': () => import('@bybas/weather-icons/design/line/animation-ready/partly-cloudy-day.svg?raw'),
  'partly-cloudy-night': () => import('@bybas/weather-icons/design/line/animation-ready/partly-cloudy-night.svg?raw'),
  'fog-day': () => import('@bybas/weather-icons/design/line/animation-ready/fog-day.svg?raw'),
  'fog-night': () => import('@bybas/weather-icons/design/line/animation-ready/fog-night.svg?raw'),
  'drizzle': () => import('@bybas/weather-icons/design/line/animation-ready/drizzle.svg?raw'),
  'partly-cloudy-day-drizzle': () => import('@bybas/weather-icons/design/line/animation-ready/partly-cloudy-day-drizzle.svg?raw'),
  'partly-cloudy-night-drizzle': () => import('@bybas/weather-icons/design/line/animation-ready/partly-cloudy-night-drizzle.svg?raw'),
  'partly-cloudy-day-rain': () => import('@bybas/weather-icons/design/line/animation-ready/partly-cloudy-day-rain.svg?raw'),
  'partly-cloudy-night-rain': () => import('@bybas/weather-icons/design/line/animation-ready/partly-cloudy-night-rain.svg?raw'),
  'sleet': () => import('@bybas/weather-icons/design/line/animation-ready/sleet.svg?raw'),
  'partly-cloudy-day-sleet': () => import('@bybas/weather-icons/design/line/animation-ready/partly-cloudy-day-sleet.svg?raw'),
  'partly-cloudy-night-sleet': () => import('@bybas/weather-icons/design/line/animation-ready/partly-cloudy-night-sleet.svg?raw'),
  'snow': () => import('@bybas/weather-icons/design/line/animation-ready/snow.svg?raw'),
  'partly-cloudy-day-snow': () => import('@bybas/weather-icons/design/line/animation-ready/partly-cloudy-day-snow.svg?raw'),
  'partly-cloudy-night-snow': () => import('@bybas/weather-icons/design/line/animation-ready/partly-cloudy-night-snow.svg?raw'),
  'thunderstorms-day': () => import('@bybas/weather-icons/design/line/animation-ready/thunderstorms-day.svg?raw'),
  'thunderstorms-night': () => import('@bybas/weather-icons/design/line/animation-ready/thunderstorms-night.svg?raw'),
  'thunderstorms-rain': () => import('@bybas/weather-icons/design/line/animation-ready/thunderstorms-rain.svg?raw'),
  'thunderstorms-day-hail': () => import('@bybas/weather-icons/design/line/animation-ready/hail.svg?raw'),
  'thunderstorms-night-hail': () => import('@bybas/weather-icons/design/line/animation-ready/hail.svg?raw'),
  
  // Utility icons
  'thermometer': () => import('@bybas/weather-icons/design/line/animation-ready/thermometer.svg?raw'),
  'barometer': () => import('@bybas/weather-icons/design/line/animation-ready/barometer.svg?raw'),
  'windsock': () => import('@bybas/weather-icons/design/line/animation-ready/windsock.svg?raw'),
  'raindrop': () => import('@bybas/weather-icons/design/line/animation-ready/raindrop.svg?raw'),
  'raindrops': () => import('@bybas/weather-icons/design/line/animation-ready/raindrops.svg?raw'),
  'umbrella': () => import('@bybas/weather-icons/design/line/animation-ready/umbrella.svg?raw'),
  'sunrise': () => import('@bybas/weather-icons/design/line/animation-ready/sunrise.svg?raw'),
  'sunset': () => import('@bybas/weather-icons/design/line/animation-ready/sunset.svg?raw'),
  'uv-index': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index.svg?raw'),
  'uv-index-1': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-1.svg?raw'),
  'uv-index-2': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-2.svg?raw'),
  'uv-index-3': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-3.svg?raw'),
  'uv-index-4': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-4.svg?raw'),
  'uv-index-5': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-5.svg?raw'),
  'uv-index-6': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-6.svg?raw'),
  'uv-index-7': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-7.svg?raw'),
  'uv-index-8': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-8.svg?raw'),
  'uv-index-9': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-9.svg?raw'),
  'uv-index-10': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-10.svg?raw'),
  'uv-index-11': () => import('@bybas/weather-icons/design/line/animation-ready/uv-index-11.svg?raw'),
  'pressure-low': () => import('@bybas/weather-icons/design/line/animation-ready/pressure-low.svg?raw'),
  'pressure-high': () => import('@bybas/weather-icons/design/line/animation-ready/pressure-high.svg?raw'),
  'fog': () => import('@bybas/weather-icons/design/line/animation-ready/fog.svg?raw'),
  'dust': () => import('@bybas/weather-icons/design/line/animation-ready/dust.svg?raw'),
}

const loadIcon = async (iconName: string) => {
  try {
    const iconLoader = iconMap[iconName]
    if (iconLoader) {
      const iconModule = await iconLoader()
      iconSvg.value = iconModule.default
    } else {
      console.error(`Icon not mapped: ${iconName}. Available icons:`, Object.keys(iconMap))
      throw new Error(`Icon not mapped: ${iconName}`)
    }
  } catch (error) {
    console.error(`Weather icon failed to load: ${iconName}`, error)
    // Fallback to a simple SVG icon with distinct color to identify fallback usage
    iconSvg.value = `<svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" fill="#ef4444" />
      <g stroke="#dc2626" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </g>
    </svg>`
  }
}

watch(() => props.icon, (newIcon) => {
  if (newIcon) {
    loadIcon(newIcon)
  }
}, { immediate: true })


onMounted(() => {
  if (props.icon) {
    loadIcon(props.icon)
  }
})
</script>

<style scoped>
.weather-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

/* Subtle float animation for main weather icons */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Clean meteocon styling with good visibility on dark background */
.weather-icon :deep(svg path),
.weather-icon :deep(svg circle),
.weather-icon :deep(svg line) {
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Minimal hover effect */
.weather-icon:hover :deep(svg) {
  opacity: 0.8;
}
</style>