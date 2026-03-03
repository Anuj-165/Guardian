import { supabase } from "../Config/supabase.js";

export const getUserBookings = async (req, res) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, hospitals(*)")
    .eq("user_id", req.user.id);

  if (error) return res.status(400).json(error);

  res.json(data);
};

export const createBooking = async (req, res) => {
  const { hospital_id } = req.body;

  const { data, error } = await supabase
    .from("bookings")
    .insert([{
      hospital_id,
      user_id: req.user.id
    }])
    .select();

  if (error) return res.status(400).json(error);

  res.json(data);
};