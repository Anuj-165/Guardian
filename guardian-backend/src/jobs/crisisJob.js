import cron from "node-cron";
import { checkEarthquakes } from "../services/earthquakeService.js";
import { checkWeather } from "../services/weatherService.js";

export const startCrisisMonitoring = () => {
  cron.schedule("*/10 * * * *", async () => {
    console.log("Running Crisis Checks...");
    await checkEarthquakes();
    await checkWeather();
  });
};