import { supabase } from "../Config/supabase.js";
import { protect } from "../Middleware/authMiddleware.js";
import { checkWeather } from "../services/checkweatherService.js";

export const getAlerts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAlert = async (req, res) => {
  try {
    const { title, description, severity, location } = req.body;

   
    if (!title || !description || !location) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const { data, error } = await supabase
      .from("alerts")
      .insert([
        {
          title,
          description,
          severity: severity || "medium",
          location,
          active: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    

    res.status(201).json({
      message: "Alert created and broadcasted successfully",
      alert: data[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getWeather = async (req, res) => {
  try {
    
    const city = req.query.city || "Delhi";
    const weatherData = await checkWeather(city);

    if (weatherData.success) {
      res.status(200).json(weatherData);
    } else {
      res.status(500).json({ message: "Unable to fetch weather" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};