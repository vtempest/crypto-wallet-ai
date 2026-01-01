import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';
import grab from "grab-url";

/**
 * Fetches open-meteo API weather forecast for latitude
 * and longitude and code symbol.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<WeatherForecast[]>}
 */
export async function getWeatherForecast(latitude, longitude) {

  const data = await grab("https://api.open-meteo.com/v1/forecast", {
    latitude,
    longitude,
    current: "temperature_2m,weather_code",
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    timezone: "auto",
    temperature_unit: "fahrenheit",
  });

  if (data.error) {
    throw new Error(`Request error: ${data.error}`);
  }
  if (data && data.current && data.daily && data.daily.time) {
    const forecast = [
      {
        date: data.current.time,
        temp: Math.round(data.current.temperature_2m),
        symbol: getWeatherSymbol(data.current.weather_code),
        rain: data.current.rain,
      },
      ...data.daily.time.slice(1).map((time, index) => ({
        date: time,
        max: Math.round(data.daily.temperature_2m_max[index + 1]),
        min: Math.round(data.daily.temperature_2m_min[index + 1]),
        symbol: getWeatherSymbol(data.daily.weather_code[index + 1]),
      })),
    ];

    return forecast;
  } else {
    throw new Error("Invalid data structure received from API");
  }
}

const getWeatherSymbol = (code) => {
  const weatherCodes = [
    { code: 0, symbol: "☀", symbolLabel: "Sunny" },
    { code: 1, symbol: "🌤", symbolLabel: "Mainly clear" },
    { code: 2, symbol: "⛅", symbolLabel: "Partly cloudy" },
    { code: 3, symbol: "☁", symbolLabel: "Overcast" },
    { code: [45, 48], symbol: "🌫", symbolLabel: "Fog" },
    { code: [51, 53, 55], symbol: "☂", symbolLabel: "Drizzle" },
    { code: [56, 57], symbol: "☂", symbolLabel: "Freezing Drizzle" },
    { code: [61, 63, 65], symbol: "☂", symbolLabel: "Rain" },
    { code: [66, 67], symbol: "☂", symbolLabel: "Freezing Rain" },
    { code: [71, 73, 75], symbol: "☃", symbolLabel: "Snow fall" },
    { code: 77, symbol: "☃", symbolLabel: "Snow grains" },
    { code: [80, 81, 82], symbol: "☔", symbolLabel: "Rain showers" },
    { code: [85, 86], symbol: "⛄", symbolLabel: "Snow showers" },
    { code: 95, symbol: "⛈", symbolLabel: "Thunderstorm" },
    { code: [96, 99], symbol: "⛈", symbolLabel: "Thunderstorm with hail" },
  ];

  for (let weather of weatherCodes) {
    if (Array.isArray(weather.code)) {
      if (weather.code.includes(code)) return weather.symbol;
    } else if (weather.code === code) return weather.symbol;
  }
  return "❓";
};

/**
 * Fetches the weather forecast for the client's current IP address.
 * @returns {Promise<{forecast: WeatherForecast[], location: string}>}
 */
export async function getWeatherForClientIP() {
  try {
    // Fetch IP info
    const ipData = await grab("https://ipinfo.io/json", {});
    if (ipData.error) {
      throw new Error(`Request error: ${ipData.error}`);
    }
    // Extract latitude and longitude
    const [latitude, longitude] = ipData.loc.split(",");

    // Get weather forecast
    const forecast = await getWeatherForecast(latitude, longitude);

    return {
      forecast,
      location: `${ipData.city}, ${ipData.region}`,
      city: ipData.city,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

const WeatherWidget = () => {
  const [data, setData] = useState<{
    temperature: number;
    condition: string;
    location: string;
    symbol: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const updateWeather = async () => {
    try {
      const weatherData = await getWeatherForClientIP();

      if (weatherData && weatherData.forecast && weatherData.forecast.length > 0) {
        const current = weatherData.forecast[0];

        setData({
          temperature: current.temp || 0,
          condition: getConditionFromSymbol(current.symbol),
          location: weatherData.city,
          symbol: current.symbol,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  const getConditionFromSymbol = (symbol: string): string => {
    const symbolMap: Record<string, string> = {
      '☀': 'Sunny',
      '🌤': 'Mainly clear',
      '⛅': 'Partly cloudy',
      '☁': 'Overcast',
      '🌫': 'Fog',
      '☂': 'Rain',
      '☃': 'Snow',
      '☔': 'Rain showers',
      '⛄': 'Snow showers',
      '⛈': 'Thunderstorm',
    };
    return symbolMap[symbol] || 'Unknown';
  };

  useEffect(() => {
    updateWeather();
    const intervalId = setInterval(updateWeather, 30 * 60 * 1000); // Update every 30 minutes
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-light-secondary dark:bg-dark-secondary rounded-2xl border border-light-200 dark:border-dark-200 shadow-sm shadow-light-200/10 dark:shadow-black/25 flex flex-row items-center w-full h-24 min-h-[96px] max-h-[96px] px-3 py-2 gap-3">
      {loading || !data ? (
        <>
          <div className="flex flex-col items-center justify-center w-16 min-w-16 max-w-16 h-full animate-pulse">
            <div className="h-10 w-10 rounded-full bg-light-200 dark:bg-dark-200 mb-2" />
            <div className="h-4 w-10 rounded bg-light-200 dark:bg-dark-200" />
          </div>
          <div className="flex flex-col justify-between flex-1 h-full py-1 animate-pulse">
            <div className="flex flex-row items-center justify-between">
              <div className="h-3 w-20 rounded bg-light-200 dark:bg-dark-200" />
              <div className="h-3 w-12 rounded bg-light-200 dark:bg-dark-200" />
            </div>
            <div className="h-3 w-16 rounded bg-light-200 dark:bg-dark-200 mt-1" />
            <div className="flex flex-row justify-between w-full mt-auto pt-1 border-t border-light-200 dark:border-dark-200">
              <div className="h-3 w-16 rounded bg-light-200 dark:bg-dark-200" />
              <div className="h-3 w-8 rounded bg-light-200 dark:bg-dark-200" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center w-16 min-w-16 max-w-16 h-full">
            <div className="text-4xl mb-1">{data.symbol}</div>
            <span className="text-base font-semibold text-black dark:text-white">
              {data.temperature}°F
            </span>
          </div>
          <div className="flex flex-col justify-between flex-1 h-full py-2">
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm font-semibold text-black dark:text-white">
                {data.location}
              </span>
            </div>
            <span className="text-xs text-black/50 dark:text-white/50 italic">
              {data.condition}
            </span>
            <div className="flex flex-row justify-between w-full mt-auto pt-2 border-t border-light-200/50 dark:border-dark-200/50 text-xs text-black/50 dark:text-white/50 font-medium">
              <span>Current Weather</span>
              <span className="font-semibold text-black/70 dark:text-white/70">
                Now
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;
