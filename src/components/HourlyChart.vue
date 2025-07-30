<template>
  <div class="glass-panel p-5">
    <!-- Header -->
    <div class="mb-5">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-xl font-semibold text-slate-100 mb-1">Temperature Forecast</h3>
          <p class="text-slate-400 text-sm">{{ getTemperatureTrend() }}</p>
        </div>
        <div class="text-right">
          <div class="text-slate-400 text-xs font-medium mb-1">Temperature Range</div>
          <div class="text-lg font-bold text-slate-100">
            {{ minTemp }}° - {{ maxTemp }}°
          </div>
        </div>
      </div>
      
      <!-- Time Range Controls -->
      <div class="flex justify-center mb-4">
        <div class="flex bg-slate-800 rounded-xl p-1.5 border border-slate-700">
          <button 
            v-for="range in timeRanges"
            :key="range.value"
            @click="selectedRange = range.value"
            class="px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            :class="selectedRange === range.value 
              ? 'bg-blue-600 text-slate-100' 
              : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Hourly forecast strip (hidden for 24h view) -->
    <div class="mb-4" v-if="selectedRange !== '24h'">
      <div class="grid gap-1" :style="{ gridTemplateColumns: `repeat(${filteredHourlyData.length}, 1fr)` }">
        <div 
          v-for="(hour, index) in filteredHourlyData" 
          :key="index"
          class="text-center p-3 transition-all duration-200"
          :class="{ 'bg-slate-800/50 rounded-lg border border-slate-700': index === 0 }"
        >
          <!-- Time -->
          <div class="text-xs mb-2 font-medium" :class="index === 0 ? 'text-blue-400' : 'text-slate-400'">
            {{ index === 0 ? 'Now' : formatHour(hour.time) }}
          </div>
          
          <!-- Weather Icon -->
          <div class="mb-3 flex justify-center">
            <WeatherIcon 
              :icon="getWeatherIconName(hour.weatherCode, isHourDay(hour.time))" 
              :weather-code="hour.weatherCode" 
              size="2.2rem"
              :interactive="true"
              :animated="index === 0"
            />
          </div>
          
          <!-- Temperature -->
          <div class="text-lg font-bold mb-1" :class="index === 0 ? 'text-blue-400' : 'text-slate-100'">
            {{ Math.round(hour.temperature) }}°
          </div>
          
          <!-- Precipitation -->
          <div class="text-xs text-blue-600 font-medium" v-if="hour.precipitation > 0">
            {{ Math.round(hour.precipitation) }}%
          </div>
          <div class="text-xs text-transparent" v-else>
            0%
          </div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="relative" :class="selectedRange === '24h' ? 'h-64' : 'h-48'">
      <canvas
        ref="chartCanvas"
        class="w-full h-full"
        :class="{ 'opacity-50': isLoading }"
      ></canvas>

      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useWeatherStore } from "@/stores/weather";
import { WEATHER_CODES } from '@/types/weather';
import WeatherIcon from '@/components/WeatherIcon.vue';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

const weatherStore = useWeatherStore();
const chartCanvas = ref<HTMLCanvasElement>();
let chartInstance: Chart | null = null;

const selectedRange = ref("12h");

const timeRanges = [
  { label: '6H', value: '6h' },
  { label: '12H', value: '12h' },
  { label: '24H', value: '24h' }
];

const isLoading = computed(() => weatherStore.isLoading);
const temperatureUnit = computed(() => weatherStore.getTemperatureUnit());

const filteredHourlyData = computed(() => {
  const data = weatherStore.hourlyData;
  if (!data.length) return [];
  
  const hoursMap = {
    '6h': 6,
    '12h': 12,
    '24h': 24
  };
  
  return data.slice(0, hoursMap[selectedRange.value] || 12);
});

const chartData = computed(() => {
  const data = filteredHourlyData.value;
  if (!data.length) return null;

  return {
    labels: data.map((item) => {
      const hour = item.time.getHours();
      return hour === 0
        ? "12 AM"
        : hour <= 12
          ? `${hour} AM`
          : `${hour - 12} PM`;
    }),
    datasets: [
      {
        label: `Temperature (${temperatureUnit.value})`,
        data: data.map((item) => item.temperature),
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124, 58, 237, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#7c3aed",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#7c3aed",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      titleColor: "#1e293b",
      bodyColor: "#475569",
      borderColor: "rgba(124, 58, 237, 0.2)",
      borderWidth: 1,
      cornerRadius: 12,
      displayColors: false,
      padding: 12,
      titleFont: {
        size: 14,
        weight: "bold" as const,
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        title: (context: any) => {
          const dataIndex = context[0].dataIndex;
          const time = filteredHourlyData.value[dataIndex]?.time;
          return time
            ? time.toLocaleString("en-US", {
                weekday: "short",
                hour: "numeric",
                minute: "2-digit",
              })
            : "";
        },
        label: (context: any) => {
          return `Temperature: ${context.parsed.y}${temperatureUnit.value}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#64748b",
        font: {
          size: 12,
          weight: "normal" as const,
        },
      },
    },
    y: {
      grid: {
        color: "rgba(124, 58, 237, 0.1)",
        borderDash: [5, 5],
      },
      ticks: {
        color: "#64748b",
        font: {
          size: 12,
          weight: "normal" as const,
        },
        callback: (value: any) => `${value}°`,
      },
    },
  },
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
  elements: {
    point: {
      hoverBorderWidth: 4,
    },
  },
}));


const minTemp = computed(() => {
  const data = filteredHourlyData.value;
  if (!data.length) return "--";
  return Math.min(...data.map((item) => item.temperature));
});

const maxTemp = computed(() => {
  const data = filteredHourlyData.value;
  if (!data.length) return "--";
  return Math.max(...data.map((item) => item.temperature));
});


const createChart = async () => {
  if (!chartCanvas.value || !chartData.value) return;

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  chartInstance = new Chart(ctx, {
    type: "line",
    data: chartData.value,
    options: chartOptions.value,
  });
};

const updateChart = () => {
  if (!chartInstance || !chartData.value) return;

  chartInstance.data = chartData.value;
  chartInstance.options = chartOptions.value;
  chartInstance.update("none");
};

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
};

// Watch for data changes
watch([chartData, selectedRange], async () => {
  if (chartInstance) {
    updateChart();
  } else {
    await nextTick();
    createChart();
  }
});

onMounted(async () => {
  await nextTick();
  createChart();
});

onUnmounted(() => {
  destroyChart();
});

const getTemperatureTrend = (): string => {
  const data = filteredHourlyData.value;
  if (data.length < 2) return 'Loading...';
  
  const current = data[0].temperature;
  const later = data[data.length - 1].temperature;
  const diff = later - current;
  
  const rangeText = selectedRange.value === '6h' ? '6 hours' : 
                   selectedRange.value === '12h' ? '12 hours' : 
                   '24 hours';
  
  if (diff > 3) return `Warming up by ${Math.round(diff)}° over ${rangeText}`;
  if (diff < -3) return `Cooling down by ${Math.round(Math.abs(diff))}° over ${rangeText}`;
  return `Stable temperatures over ${rangeText}`;
};

const formatHour = (date: Date): string => {
  const hour = date.getHours();
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
};

const getWeatherIconName = (weatherCode: number, isDay: boolean): string => {
  const weatherInfo = (WEATHER_CODES as any)[weatherCode];
  if (!weatherInfo) return 'clear-day';
  return isDay ? weatherInfo.day_icon : weatherInfo.night_icon;
};

const isHourDay = (date: Date): boolean => {
  const hour = date.getHours();
  return hour >= 6 && hour < 20;
};
</script>

<style scoped>
/* Clean, minimal styles */
</style>
