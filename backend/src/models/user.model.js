import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ACCESS_TOKEN_CONFIG, REFRESH_TOKEN_CONFIG } from "../config/index.js";
import Captain from "./captain.model.js";

const userSchema = mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      default:"",
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isCaptain : {
    type: Boolean,
    default: false,
  },
  socketId: {
    type: String,
  },
  refreshToken: {
    type: String,
    default: "",
  }
});

userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign({_id: this._id}, process.env.REFRESH_TOKEN_SECRET, REFRESH_TOKEN_CONFIG);
}

userSchema.methods.generateAccessToken = async function () {
  let payload = {
    _id: this.id,
    fullname: this.fullname,
    email: this.email,
    isCaptain: this.isCaptain,
  };
  if(this.isCaptain) {
    payload = {
      ...payload,
      captainId: (await Captain.findOne({user: this._id}))._id
    }
  }
  return await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, ACCESS_TOKEN_CONFIG);
}


userSchema.methods.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
}

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;