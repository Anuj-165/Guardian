import { supabase } from "../Config/supabase.js";

export const getResources = async (req, res) => {
  const { data, error } = await supabase
    .from("resources")
    .select("*");

  if (error) return res.status(400).json(error);

  res.json(data);
};

export const createResource = async (req, res) => {
  const { name, quantity, location , type } = req.body;

  const { data, error } = await supabase
    .from("resources")
    .insert([{ name, quantity, location ,type }])
    .select();

  if (error) return res.status(400).json(error);

  res.json(data);
};