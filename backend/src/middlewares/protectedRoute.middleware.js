import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    const at = req?.cookies?.at || req.header("Authorization")?.split(' ')[1];
    if(!at) {
      return res.status(401).json({"message": "Invalid credential Login."})
    }

    let decoded = "";
    try {
      decoded = await jwt.verify(at, process.env.ACCESS_TOKEN_SECRET);
    }
    catch (err) {
      console.log(err?.message);
      return res.status(401).json({"message": err?.message || "Invalid credential Login."});
    }
    
    if(!decoded || !decoded._id) {
      return res.status(401).json({"message": "Login required."});
    }
    
    req.user = decoded;
    
    return next();
  }
  
  catch(err) {
    console.log("jwt auth error:",err?.message);
    return res.status(500).json({"message": "internal server Error."});
  }
} 
