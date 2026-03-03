import axios from "axios";
import { supabase } from "../Config/supabase.js";
import { redisClient } from "../Config/redis.js";

export const checkEarthquakes = async () => {
  try {
    const response = await axios.get(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
    );

    const earthquakes = response.data.features;

    for (let quake of earthquakes) {
      const magnitude = quake.properties.mag;
      const place = quake.properties.place;

      if (magnitude >= 5) {

        const { data } = await supabase
          .from("alerts")
          .insert([{
            title: "Earthquake Alert",
            description: `${place} | Magnitude: ${magnitude}`,
            severity: magnitude >= 6 ? "high" : "medium",
            created_by: null
          }])
          .select();

        await redisClient.publish("alerts", JSON.stringify(data[0]));
      }
    }

  } catch (err) {
    console.log("Earthquake Service Error:", err.message);
  }
};