import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Use jwt.verify instead of supabase.auth.getUser
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    
    // Attach the user data to the request
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};