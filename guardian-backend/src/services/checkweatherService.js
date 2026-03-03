import axios from "axios";
import { supabase } from "../Config/supabase.js";
import { redisClient } from "../Config/redis.js";

export const checkWeather = async (locationQuery = "Delhi") => {
  try {
    const API_KEY = process.env.WEATHER_API_KEY;
    const BASE_URL = "http://api.weatherapi.com/v1/current.json";

    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${locationQuery}&aqi=no`);

    const { current, location } = response.data;
    
    
    const temp = current.temp_c;
    const windSpeed = current.wind_kph;
    const condition = current.condition.text;
    const icon = current.condition.icon;

    
    if (windSpeed > 25 || condition.toLowerCase().includes("storm")) {
      const { data: alert } = await supabase
        .from("alerts")
        .insert([{
          title: "Weather Warning",
          description: `${condition} in ${location.name}. Temp: ${temp}°C, Wind: ${windSpeed}km/h`,
          severity: windSpeed > 50 ? "high" : "medium",
          location: location.name,
          active: true
        }])
        .select();

      if (alert && alert.length > 0) {
        await redisClient.publish("alerts", JSON.stringify(alert[0]));
      }
    }

    
    return {
      success: true,
      city: location.name,
      temp: temp,
      condition: condition,
      icon: `https:${icon}`, 
      humidity: current.humidity,
      wind: windSpeed
    };

  } catch (err) {
    console.error("Weather Service Error:", err.response?.data?.error?.message || err.message);
    return { success: false, error: "Could not fetch weather data" };
  }
};