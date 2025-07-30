import { computed, ref, watch } from "vue";
import { useWeatherStore } from "@/stores/weather";
import type { WeatherApiResponse } from "@/types/weather";

export function useWeatherApi() {
  const weatherStore = useWeatherStore();
  const refreshInterval = ref(15 * 60 * 1000); // 15 minutes in milliseconds
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const buildApiUrl = (lat: number, lng: number) => {
    const baseUrl = "https://api.open-meteo.com/v1/forecast";

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      current: [
        "temperature_2m",
        "windspeed_10m",
        "winddirection_10m",
        "weather_code",
        "relative_humidity_2m",
        "surface_pressure",
        "visibility",
        "cloud_cover",
      ].join(","),
      hourly: [
        "temperature_2m",
        "precipitation_probability",
        "windspeed_10m",
        "winddirection_10m",
        "weather_code",
      ].join(","),
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "sunrise",
        "sunset",
        "precipitation_sum",
        "windspeed_10m_max",
        "winddirection_10m_dominant",
        "uv_index_max",
      ].join(","),
      timezone: "auto",
      forecast_days: "7",
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const fetchWeather = async () => {
    try {
      if (!weatherStore.location) {
        console.warn("No location available for weather fetch");
        return;
      }

      isLoading.value = true;
      weatherStore.setLoading(true);
      weatherStore.clearError();

      const { lat, lng } = weatherStore.location;
      const url = buildApiUrl(lat, lng);

      console.log("Fetching weather from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WeatherApiResponse = await response.json();
      weatherStore.setWeatherData(data);
      weatherStore.setLoading(false);
      error.value = null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Weather fetch error:", errorMessage);
      error.value = err instanceof Error ? err : new Error(errorMessage);
      weatherStore.setError(`Unable to fetch weather data: ${errorMessage}`);
      weatherStore.setLoading(false);
    } finally {
      isLoading.value = false;
    }
  };

  // Watch for location changes and refetch
  watch(
    () => weatherStore.location,
    (newLocation) => {
      if (newLocation) {
        fetchWeather();
      }
    },
    { deep: true }
  );

  // Auto-refresh functionality
  let refreshTimer: number | null = null;

  const startAutoRefresh = () => {
    stopAutoRefresh();
    refreshTimer = setInterval(() => {
      fetchWeather();
    }, refreshInterval.value);
  };

  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  };

  const setRefreshInterval = (minutes: number) => {
    refreshInterval.value = minutes * 60 * 1000;
    if (refreshTimer) {
      startAutoRefresh(); // Restart with new interval
    }
  };

  // Initial fetch
  const initializeWeatherData = async () => {
    await fetchWeather();
    startAutoRefresh();
  };

  // Cleanup function
  const cleanup = () => {
    stopAutoRefresh();
  };

  return {
    // State
    isLoading,
    error,

    // Actions
    fetchWeather,
    initializeWeatherData,
    startAutoRefresh,
    stopAutoRefresh,
    setRefreshInterval,
    cleanup,

    // Computed
    refreshInterval: computed(() => refreshInterval.value / 60000), // Return in minutes
  };
}
