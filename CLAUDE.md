# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Core Development:**
- `npm run dev` - Start Vite development server with HMR
- `npm run build` - TypeScript compilation + Vite production build  
- `npm run preview` - Preview production build locally

**Key Development Notes:**
- Default location is Berlin (52.52°N, 13.41°E) - modify in `src/stores/weather.ts`
- Auto-refresh interval is 15 minutes - configurable in `src/composables/useWeatherApi.ts`
- No API key required - uses free Open-Meteo API

## Architecture Overview

### Component Data Flow
```
Open-Meteo API → useWeatherApi composable → Pinia Store → Vue Components
                                               ↓
                                    Computed Properties → Reactive UI
```

### State Management Pattern
The application uses a single Pinia store (`src/stores/weather.ts`) with the Composition API pattern:

- **Raw Data**: `weatherData` stores the complete Open-Meteo API response
- **Processed Data**: Computed properties transform raw data for component consumption
- **UI State**: `isLoading`, `error`, `lastUpdated` for user feedback
- **User Preferences**: `location`, `units` (temperature C/F, wind speed, etc.)

Key computed properties include:
- `currentWeather` - Current conditions with unit conversions
- `hourlyData` - Next 24 hours filtered and processed  
- `dailyData` - 7-day forecast with sunrise/sunset calculations
- `backgroundGradient` - Dynamic theme based on temperature and time of day

### API Integration Architecture
Uses VueUse's `useFetch` with reactive URL construction:
- URL automatically rebuilds when `location` changes in store
- Watchers sync API responses to Pinia store
- Auto-refresh timer with cleanup on component unmount
- Error handling flows through store to UI components

### Glassmorphism Design System
Consistent styling pattern across all components:
- `.glass-panel` base class for frosted glass effect
- Weather-adaptive backgrounds (blue for cold, orange for warm)
- Custom Tailwind animations: `fade-in`, `slide-up`, `pulse-slow`
- Mobile-first responsive grid layouts

## Component Architecture

### CurrentConditions.vue
Primary weather display with large temperature, current conditions, and unit toggle. Showcases Vue reactivity with computed temperature conversions and weather icon selection.

### HourlyChart.vue  
Chart.js integration with Vue lifecycle management. Key patterns:
- Chart instance creation/destruction in `onMounted`/`onUnmounted`
- Reactive data updates via watchers
- Time range filtering (6h/12h/24h selectors)
- Custom Chart.js configuration for glassmorphism theme

### PrecipitationGauge.vue & WindCompass.vue
SVG-based visualizations with:
- Custom SVG animations using CSS transitions
- Computed properties for gauge calculations (stroke-dashoffset patterns)
- Color-coded data representation
- Responsive scaling

### WeeklyForecast.vue
Expandable forecast cards with:
- State management for selected day (`selectedDay` ref)
- Temperature range visualizations using computed widths
- Dynamic weather icon selection from `WEATHER_CODES` mapping

## TypeScript Integration

### Type Structure
- `src/types/weather.ts` contains complete type definitions
- API response types mirror Open-Meteo structure exactly
- Processed types (`ProcessedHourlyData`, `ProcessedDailyData`) for component props
- Weather code mapping with 116 weather conditions and emoji icons

### Key Patterns
- All components use `<script setup lang="ts">` 
- Computed properties have proper return type inference
- Store typing with `defineStore` and typed returns
- VueUse composables maintain full TypeScript support

## Configuration Files

### Vite Setup (`vite.config.ts`)
- Path alias `@` points to `src/` for clean imports
- Vue plugin with full TypeScript support

### Tailwind Config (`tailwind.config.js`)
- Custom color scales: `weather-blue` and `weather-orange` (50-900)
- Extended animations and backdrop blur utilities
- Inter font family integration

## Weather Data Structure

The Open-Meteo API provides:
- **Current**: Real-time temperature, wind, weather codes
- **Hourly**: Next 168 hours of temperature, precipitation probability, wind data  
- **Daily**: 7-day forecast with min/max temps, sunrise/sunset, precipitation totals

Data is filtered and processed in store computed properties before reaching components, ensuring consistent units and formatting across the application.

## Development Patterns

### Reactive Updates
Location changes trigger automatic API refetch through reactive URL computation. Unit preference changes instantly update all displayed values via computed properties.

### Performance Considerations  
- Chart.js instances properly cleaned up to prevent memory leaks
- Auto-refresh timers cleared on component unmount
- Computed properties cache expensive calculations
- Components use selective reactivity to minimize re-renders

### Error Handling
Comprehensive error states flow from API → composable → store → UI with user-friendly messaging and visual indicators.