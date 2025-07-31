# Vue Weather Dashboard 🌤️

<img width="1030" height="508" alt="Screenshot 2025-07-29 at 8 29 25 PM" src="https://github.com/user-attachments/assets/ddb2e818-f780-4014-b4fb-2fd366b62095" />

> A sophisticated weather dashboard built with Vue 3, TypeScript, and modern web technologies to showcase advanced frontend development skills.

**[Live Demo (TBA)](#)** | **[Portfolio](https://devonhills.dev)** | **[LinkedIn](https://linkedin.com/in/devonjhills)**

## 📋 Portfolio Overview

This project demonstrates proficiency in:
- **Vue 3 Composition API** - Modern reactive patterns and lifecycle management
- **TypeScript Integration** - Type-safe development with interfaces and generics
- **State Management** - Pinia for efficient, scalable data flow
- **API Integration** - RESTful services with error handling and caching
- **Responsive Design** - Mobile-first CSS with Tailwind utility framework
- **Component Architecture** - Reusable, maintainable component design patterns
- **Real-time Data** - Live updates with automatic refresh mechanisms
- **Modern Build Tools** - Vite for lightning-fast development experience

## ✨ Key Features & Technical Highlights

### 🎯 **Advanced Vue 3 Implementation**
- **Composition API** with reactive refs and computed properties
- **Custom composables** for weather API integration and data processing
- **TypeScript interfaces** for complete type safety across the application
- **Pinia state management** with computed getters and reactive updates

### 🌍 **Location & Geospatial Features**
- **Automatic geolocation** with fallback to default coordinates
- **Coordinate display** in standard GPS format (e.g., 52.52°N, 13.41°E)
- **Timezone detection** with full timezone names and abbreviations
- **Real-time local time** with minute-accurate updates

### 📊 **Data Visualization & UX**
- **Interactive Chart.js integration** with temperature trend visualization
- **Custom SVG components** for wind compass and precipitation gauges
- **Dynamic weather icons** using @bybas/weather-icons (Meteocons)
- **Responsive grid layouts** adapting to different screen sizes

### 🎨 **Modern Design System**
- **Dark theme** with carefully crafted color hierarchy
- **Glassmorphism effects** using backdrop-blur and transparency
- **Minimalist iconography** with prominent weather icon displays
- **Smooth animations** and hover effects for enhanced user experience

### ⚡ **Performance & Architecture**
- **Efficient API calls** with 15-minute refresh intervals
- **Component-based architecture** with clear separation of concerns
- **Reactive data flow** from API → Composables → Pinia → Components
- **Clean code practices** with consistent naming and documentation

## 🛠️ Technical Stack

| Category | Technology | Usage |
|----------|------------|--------|
| **Frontend Framework** | Vue 3 | Composition API, reactive system |
| **Language** | TypeScript | Type safety, interfaces, generics |
| **State Management** | Pinia | Reactive stores, computed properties |
| **Styling** | Tailwind CSS | Utility-first styling, dark theme |
| **Charts** | Chart.js | Interactive temperature visualizations |
| **Icons** | @bybas/weather-icons | Beautiful meteocon weather icons |
| **Build Tool** | Vite | Fast builds, HMR, optimized bundling |
| **API** | Open-Meteo | Real-time weather data (no API key) |
| **Utilities** | VueUse | Composable utilities for Vue |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Architecture

```
vue-weather/
├── src/
│   ├── components/           # Vue components with TypeScript
│   │   ├── WeatherIcon.vue   # Dynamic weather icon system
│   │   ├── CurrentConditions.vue # Main weather display
│   │   ├── HourlyChart.vue   # Chart.js integration
│   │   ├── WeeklyForecast.vue # 7-day forecast cards
│   │   ├── PrecipitationGauge.vue # Custom SVG gauge
│   │   └── WindCompass.vue   # Animated wind direction
│   ├── composables/          # Custom Vue composables
│   │   └── useWeatherApi.ts  # API integration logic
│   ├── stores/               # Pinia state management
│   │   └── weather.ts        # Weather data store
│   ├── types/                # TypeScript definitions
│   │   └── weather.ts        # Interface definitions
│   ├── App.vue               # Root component
│   ├── main.ts               # Application bootstrap
│   └── style.css             # Global styles & design system
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration  
├── vite.config.ts            # Vite build configuration
└── package.json              # Dependencies & scripts
```

## 🎯 Component Showcase

### CurrentConditions.vue
**Demonstrates**: Component composition, computed properties, conditional rendering
- Large temperature display with proper TypeScript typing
- Weather stat cards with 50/50 icon-to-info layout design
- Dynamic weather icon integration with real-time updates
- Responsive grid system adapting to different screen sizes

```vue
<script setup lang="ts">
const currentWeather = computed(() => weatherStore.currentWeather)
const temperatureUnit = computed(() => weatherStore.getTemperatureUnit())
</script>
```

### useWeatherApi.ts Composable
**Demonstrates**: Custom composables, API integration, error handling
- RESTful API integration with Open-Meteo weather service
- Automatic refresh mechanism with cleanup on unmount
- TypeScript interfaces for API response typing
- Error boundary handling with user-friendly messages

```typescript
export function useWeatherApi() {
  const weatherStore = useWeatherStore()
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  
  const fetchWeatherData = async () => {
    // Implementation with proper error handling
  }
}
```

### Pinia Store Implementation
**Demonstrates**: State management, computed properties, data transformation
- Reactive weather data store with computed getters
- Unit conversion logic (Celsius/Fahrenheit, km/h to mph)
- Data processing pipeline from raw API to component-ready format

## 🌟 Development Highlights

### **Type Safety**
Complete TypeScript implementation with:
- Interface definitions for all API responses
- Generic types for reusable components
- Proper typing for Pinia stores and composables

### **Responsive Design**
Mobile-first approach featuring:
- Flexible grid layouts using CSS Grid and Flexbox
- Adaptive component sizing based on screen breakpoints
- Touch-friendly interactions and hover states

### **Real-time Features**
- Live local time updates with timezone detection
- GPS coordinate display in standard format
- 15-minute automatic weather data refresh
- Dynamic weather condition updates

### **Performance Optimizations**
- Efficient Vue reactivity with computed properties
- Lazy loading of weather icons and components
- Optimized API calls with proper caching strategies
- Clean component lifecycle management

## 🎨 Design System

### **Dark Theme Implementation**
- Consistent color hierarchy using Tailwind's slate palette
- Proper contrast ratios for accessibility compliance
- Subtle glassmorphism effects with backdrop-blur
- Smooth transitions and hover states

### **Component Design Patterns**
- **50/50 Layout**: Icons take half the space, info takes the other half
- **Prominent Icons**: Weather icons are the focal point of each component
- **Minimalist Approach**: Clean design without unnecessary decorative elements
- **Consistent Spacing**: Systematic use of Tailwind's spacing scale

## 📊 Data Flow Architecture

```
Open-Meteo API → useWeatherApi → Pinia Store → Components
                                      ↓
                              Computed Properties → Reactive UI
```

1. **API Layer**: RESTful calls to Open-Meteo with error handling
2. **Composable Layer**: Data fetching, processing, and lifecycle management  
3. **Store Layer**: Reactive state management with computed properties
4. **Component Layer**: Presentation logic with TypeScript props/emits

## 🚀 Professional Development Practices

- **Clean Code**: Consistent naming conventions and comprehensive documentation
- **Component Architecture**: Reusable, maintainable component design patterns
- **TypeScript Best Practices**: Proper interface design and type inference
- **Git Workflow**: Conventional commits and feature-based development
- **Performance Monitoring**: Efficient rendering and memory management
- **Accessibility**: Semantic HTML and proper ARIA attributes

## 📈 Skills Demonstrated

| Skill Category | Technologies & Concepts |
|----------------|------------------------|
| **Frontend Frameworks** | Vue 3 Composition API, Component lifecycle, Reactive system |
| **Type Systems** | TypeScript interfaces, Generics, Type inference |
| **State Management** | Pinia stores, Computed properties, Reactive data flow |
| **API Integration** | RESTful services, Error handling, Data transformation |
| **Styling & Design** | Tailwind CSS, Responsive design, Dark themes |
| **Build Tools** | Vite configuration, Bundle optimization, Development workflow |
| **Code Quality** | ESLint, Prettier, TypeScript strict mode |

## 🌐 Browser Support

- **Chrome 90+** - Full feature support with modern JavaScript
- **Firefox 88+** - Complete compatibility with all animations
- **Safari 14+** - Optimized for WebKit rendering engine
- **Edge 90+** - Tested across Windows and macOS

## 📞 Contact & Portfolio

This project is part of my software engineering portfolio demonstrating expertise in modern Vue.js development, TypeScript integration, and responsive web design.

**Portfolio**: [yourportfolio.com](#)  
**LinkedIn**: [linkedin.com/in/yourprofile](#)  
**GitHub**: [github.com/yourusername](#)  
**Email**: your.email@example.com

---

**Built with Vue 3, TypeScript, and modern web technologies to showcase professional frontend development capabilities.**
