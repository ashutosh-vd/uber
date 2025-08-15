import { COOKIE_CONFIG } from "../config/index.js";
import Captain from "../models/captain.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUserController = async (req, res) => {
  const {fullname, email, password, isCaptain, vehicle = null} = req.body;
  if(!email.trim() || !fullname.firstname.trim() || !password) {
    return res.status(400).json({"message": "The email, firstname and password fields are necessary."});
  }
  try {
    let user = await User.findOne({ email });
    if(user) {
      return res.status(400).json({"message": "User with email already exists."});
    }
    
    if (password.length < 6) {
      return res.status(400).json({"message": "Password less than 6 chars."})
    }
    user = new User({
      fullname, 
      email,
      isCaptain,
    });

    const hashedPassword = await user.hashPassword(password);
    user.password = hashedPassword;
    
    user = await user.save();
    if(!user) {
      return res.status(500).json({"message": "user creation failed."})
    }

    if(isCaptain) {
      try {
        if(!vehicle?.plate?.trim() || !vehicle?.vehicleType?.trim() || !vehicle?.capacity) {
          return res.status(401).json({"message": "vehicle filed necessary for Captain."});
        }
        const captain = new Captain({
          user: user._id,
          vehicle,
        });

        await captain.save();
      }
      catch (err) {
        console.log(err.message);
        return res.status(500).json({"message": "captain creation failed"});
      }
    }

    user.refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    await user.save();

    res.status(200).cookie("rt", user.refreshToken).cookie("at", accessToken).json({
      accessToken, user
    });
  }
  catch(err) {
    console.log(err?.message);
    res.status(500).json({"message": "Internal Server Error."});
  }
};

export const loginUserController =async (req, res) => {
  const {email, password} = req.body;
  if(!email?.trim()) {
    return res.status(401).json({"message": "provide an email."})
  }
  try {
    let user = await User.findOne({ email });
    if(!user || !(await user.comparePassword(password))) {
      return res.status(400).json({"message" : "invalid Credentials."});
    }
    user.refreshToken = await user.generateRefreshToken();
    await user.save();

    const accessToken = await user.generateAccessToken();
    if(!user.refreshToken || !accessToken) {
      return res.send(500).json({"message": "login failed"});
    }

    return res.status(200)
    .cookie("at", accessToken)
    .cookie("rt", user.refreshToken)
    .json({
      "fullname": user.fullname,
      "email": user.email,
      "isCaptain": user.isCaptain,
    });
  }
  catch(err) {
    console.log(err?.message);
    return res.status(501).json({"message": "Internal Server Error."});
  }
};

export const logoutUserController = async (req, res) => {
  try{
    await User.findOneAndUpdate({_id : req.user._id}, {$unset: { refreshToken: 1 } });
  }
  catch(err) {
    console.log(err?.message);
    return res.status(500).json({"message": "refresh token delete unsuccessfull"});
  }
  return res.status(200)
  .clearCookie('at')
  .clearCookie('rt')
  .json({"message": "user logout successfull"});
};

export const refreshAccessToken = async (req, res) => {
  if(!req?.cookies?.rt) {
    return res.status(401).json({"message": "login required."});
  }
  try {
    const refreshToken = req.cookies.rt;
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if(!decodedRefreshToken?._id) {
      return res.status(401).json({"message" : "Expired Token"});
    }
    const user = await User.findOne({_id : decodedRefreshToken._id});
    
    if(!user) {
      return res.status(401).json({"message": "Invalid"});
    }
    if(decodedRefreshToken !== user?.refreshToken) {
      res.status(401).json({"message": "Invalid"});
    }

    const at = user.generateAccessToken();

    return res.status(200).cookie("at", at, COOKIE_CONFIG);
  }
  catch (err) {
    console.log(err?.message);
    return res.status(500).json({"message": "JWT error"});
  }
}