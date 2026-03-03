import { supabase } from "../Config/supabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password: hashedPassword, name }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "User created successfully", user: data[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    
    if (error || !user) {
      console.log("Login attempt failed: User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login attempt failed: Password mismatch");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    
    res.status(200).json({ 
      message: "Login successful", 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name 
      }
    });
  } catch (error) {
    console.error("Login Controller Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};