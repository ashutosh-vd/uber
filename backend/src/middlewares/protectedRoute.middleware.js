import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    const at = req?.cookies?.at || req.header("Authorization")?.split(' ')[1];
    if(!at) {
      return res.status(401).json({"message": "Invalid credential Login."})
    }
    const decoded = jwt.verify(at, process.env.ACCESS_TOKEN_SECRET);
    if(!decoded || !decoded._id) {
      return res.status(401).json({"message": "Login required."});
    }
    req.user = decoded;
    return next();
  }
  catch(err) {
    console.log(err?.message);
    return res.status(500).json({"message": "internal server Error."});
  }
} 