import axios from "axios";
import { supabase } from "../Config/supabase.js";
import { redisClient } from "../Config/redis.js";

export const checkWeather = async (locationQuery = "Delhi") => {
  try {
    const API_KEY = process.env.WEATHER_API_KEY;
    const BASE_URL = "http://api.weatherapi.com/v1/current.json";

    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${locationQuery}&aqi=no`);

    const { current, location } = response.data;
    
    const windSpeed = current.wind_kph;
    const condition = current.condition.text;

    if (windSpeed > 25 || condition.toLowerCase().includes("storm")) {
      const { data: alert } = await supabase
        .from("alerts")
        .insert([{
          title: "Weather Warning",
          description: `${condition} in ${location.name}. Wind: ${windSpeed}km/h`,
          severity: windSpeed > 50 ? "high" : "medium",
          created_by: null
        }])
        .select();

      if (alert && alert.length > 0) {
        await redisClient.publish("alerts", JSON.stringify(alert[0]));
      }
    }
  } catch (err) {
    console.error("Weather Service Error:", err.response?.data?.error?.message || err.message);
  }
};