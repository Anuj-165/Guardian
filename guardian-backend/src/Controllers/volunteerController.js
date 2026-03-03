import { supabase } from "../Config/supabase.js";

export const registerVolunteer = async (req, res) => {
  const { phone, skills, availability } = req.body;

  const { data, error } = await supabase
    .from("volunteers")
    .insert([{
      user_id: req.user.id,
      phone,
      skills,
      availability
    }])
    .select();

  if (error) return res.status(400).json(error);

  res.json(data);
};

export const getMyVolunteerProfile = async (req, res) => {
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .eq("user_id", req.user.id)
    .single();

  if (error) return res.status(400).json(error);

  res.json(data);
};