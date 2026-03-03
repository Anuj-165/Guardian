import { supabase } from "../Config/supabase.js";
import { redisClient } from "../Config/redis.js";

export const getHospitals = async (req, res) => {
  const cache = await redisClient.get("hospitals");

  if (cache) return res.json(JSON.parse(cache));

  const { data, error } = await supabase
    .from("hospitals")
    .select("*");

  if (error) return res.status(400).json(error);

  await redisClient.set("hospitals", JSON.stringify(data), { EX: 60 });

  res.json(data);
};

export const createHospital = async (req, res) => {
  const { name, location, total_beds, available_beds } = req.body;

  const { data, error } = await supabase
    .from("hospitals")
    .insert([{ name, location, total_beds, available_beds }])
    .select();

  if (error) return res.status(400).json(error);

  await redisClient.del("hospitals"); // clear cache

  res.json(data);
};

export const updateHospital = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("hospitals")
    .update(req.body)
    .eq("id", id)
    .select();

  if (error) return res.status(400).json(error);

  await redisClient.del("hospitals");

  res.json(data);
};

export const deleteHospital = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("hospitals")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json(error);

  await redisClient.del("hospitals");

  res.json({ message: "Deleted successfully" });
};