<template>
  <button 
    class="kurz-button rounded-full px-8 py-4 font-black text-lg
           transform transition-all duration-300 
           hover:scale-110 active:scale-95
           focus:outline-none focus:ring-4 focus:ring-opacity-50
           shadow-kurz hover:shadow-kurz-lg
           animate-pulse-glow"
    :class="[
      colorClasses,
      sizeClasses,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <!-- Icon -->
    <span 
      v-if="icon" 
      class="kurz-button-icon mr-3 text-xl"
      :class="{ 'animate-spin': loading }"
    >
      {{ loading ? '⟳' : icon }}
    </span>

    <!-- Text -->
    <span class="kurz-button-text">
      {{ loading ? loadingText : text }}
    </span>

    <!-- Trailing icon -->
    <span v-if="trailingIcon" class="kurz-button-trailing-icon ml-3 text-xl">
      {{ trailingIcon }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text: string
  icon?: string
  trailingIcon?: string
  color?: 'blue' | 'cyan' | 'orange' | 'yellow' | 'purple' | 'green' | 'red' | 'pink' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  size: 'md',
  disabled: false,
  loading: false,
  loadingText: 'Loading...'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const colorClasses = computed(() => {
  const colorMap = {
    blue: 'bg-kurz-blue hover:bg-kurz-blue/90 text-white focus:ring-kurz-blue',
    cyan: 'bg-kurz-cyan hover:bg-kurz-cyan/90 text-white focus:ring-kurz-cyan',
    orange: 'bg-kurz-orange hover:bg-kurz-orange/90 text-white focus:ring-kurz-orange',
    yellow: 'bg-kurz-yellow hover:bg-kurz-yellow/90 text-kurz-space-dark focus:ring-kurz-yellow',
    purple: 'bg-kurz-purple hover:bg-kurz-purple/90 text-white focus:ring-kurz-purple',
    green: 'bg-kurz-green hover:bg-kurz-green/90 text-white focus:ring-kurz-green',
    red: 'bg-kurz-red hover:bg-kurz-red/90 text-white focus:ring-kurz-red',
    pink: 'bg-kurz-pink hover:bg-kurz-pink/90 text-white focus:ring-kurz-pink',
    white: 'bg-kurz-white hover:bg-kurz-light-gray text-kurz-space-dark focus:ring-kurz-gray'
  }
  return colorMap[props.color]
})

const sizeClasses = computed(() => {
  const sizeMap = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-4 text-lg',
    lg: 'px-10 py-5 text-xl',
    xl: 'px-12 py-6 text-2xl'
  }
  return sizeMap[props.size]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.kurz-button {
  position: relative;
  overflow: hidden;
  will-change: transform;
}

.kurz-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.kurz-button:hover::before {
  left: 100%;
}

.kurz-button:hover {
  transform: translateY(-3px) scale(1.05);
}

.kurz-button:active {
  transform: translateY(0) scale(0.98);
}

/* Special glow effects for different colors */
.kurz-button:hover {
  filter: brightness(1.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .kurz-button {
    @apply px-6 py-3 text-base;
  }
  
  .kurz-button-icon,
  .kurz-button-trailing-icon {
    @apply text-lg mr-2 ml-2;
  }
}

/* Loading state */
.kurz-button[disabled] {
  animation: none;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .kurz-button {
    transition: none;
    animation: none;
  }
  
  .kurz-button::before {
    transition: none;
  }
}
</style>