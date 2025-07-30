<template>
  <div 
    class="kurz-card bg-weather-card-bg rounded-4xl p-8 shadow-kurz-lg
           transform transition-all duration-300 hover:scale-105 hover:shadow-kurz-glow
           border-t-8 animate-fade-in"
    :class="borderColorClass"
    :style="{ animationDelay: `${delay}ms` }"
  >
    <!-- Icon -->
    <div 
      v-if="icon"
      class="kurz-card-icon text-6xl mb-6 transform animate-float"
      :style="{ animationDelay: `${delay + 200}ms` }"
    >
      {{ icon }}
    </div>

    <!-- Title -->
    <h3 
      class="kurz-card-title text-2xl font-black text-weather-text-primary mb-4"
      :class="titleColorClass"
    >
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="kurz-card-description text-weather-text-secondary text-lg leading-relaxed mb-6">
      {{ description }}
    </p>

    <!-- Value Display (for metrics) -->
    <div 
      v-if="value"
      class="kurz-card-value text-4xl font-black mb-2"
      :class="valueColorClass"
    >
      {{ value }}
      <span v-if="unit" class="text-xl font-bold opacity-80">{{ unit }}</span>
    </div>

    <!-- Extra info -->
    <div 
      v-if="extra"
      class="kurz-card-extra text-sm text-weather-text-secondary/70"
    >
      {{ extra }}
    </div>

    <!-- Slot for custom content -->
    <div v-if="$slots.default" class="kurz-card-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  description?: string
  icon?: string
  value?: string | number
  unit?: string
  extra?: string
  color?: 'blue' | 'cyan' | 'orange' | 'yellow' | 'purple' | 'green' | 'red' | 'pink'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  delay: 0
})

const borderColorClass = computed(() => {
  const colorMap = {
    blue: 'border-t-kurz-blue',
    cyan: 'border-t-kurz-cyan',
    orange: 'border-t-kurz-orange',
    yellow: 'border-t-kurz-yellow',
    purple: 'border-t-kurz-purple',
    green: 'border-t-kurz-green',
    red: 'border-t-kurz-red',
    pink: 'border-t-kurz-pink'
  }
  return colorMap[props.color]
})

const titleColorClass = computed(() => {
  const colorMap = {
    blue: 'text-kurz-blue',
    cyan: 'text-kurz-cyan',
    orange: 'text-kurz-orange',
    yellow: 'text-kurz-yellow',
    purple: 'text-kurz-purple',
    green: 'text-kurz-green',
    red: 'text-kurz-red',
    pink: 'text-kurz-pink'
  }
  return colorMap[props.color]
})

const valueColorClass = computed(() => {
  const colorMap = {
    blue: 'text-kurz-blue',
    cyan: 'text-kurz-cyan',
    orange: 'text-kurz-orange',
    yellow: 'text-kurz-yellow',
    purple: 'text-kurz-purple',
    green: 'text-kurz-green',
    red: 'text-kurz-red',
    pink: 'text-kurz-pink'
  }
  return colorMap[props.color]
})
</script>

<style scoped>
.kurz-card {
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.kurz-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
  border-radius: inherit;
}

.kurz-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.kurz-card-icon {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .kurz-card {
    @apply p-6;
  }
  
  .kurz-card-icon {
    @apply text-5xl mb-4;
  }
  
  .kurz-card-title {
    @apply text-xl mb-3;
  }
  
  .kurz-card-description {
    @apply text-base mb-4;
  }
  
  .kurz-card-value {
    @apply text-3xl;
  }
}
</style>