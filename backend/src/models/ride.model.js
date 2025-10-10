import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  captain: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "Captain"
  },
  pickup: {
    type: {
      name: String,
      lat: Number,
      lon: Number
    },
    required: true,
  },
  drop: {
    type: {
      name: String,
      lat: Number,
      lon: Number
    },
    required: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "PENDING", "ACCEPTED", "CANCELLED", "COMPLETED"],
    default: "PENDING"
  },
  otp: {
    type: String,
    required: true,
  },
}, {timestamps: true});

rideSchema.methods.generateOtp = function () {
  return Math.floor(Math.random() * 1000000);
};

rideSchema.methods.compareOtp = function (captainOtp) {
  return this.otp === captainOtp;
}

export const Ride = mongoose.model("Ride", rideSchema);

export default Ride;