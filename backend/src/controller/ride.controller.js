import Ride from "../models/ride.model.js";

export const createRideController = async (req, res) => {
  const { pickup , drop } = req.body;
  const { _id : userId } = req.user;

  if(!pickup || !drop) {
    return res.status(400).json({"message": "pickup and drop location required."});
  }
  if(!req.user) {
    res.status(401).json({"message": "login required."});
  }
  try {
    const newRide = await new Ride({
      user: userId,
      pickup,
      drop
    });

    newRide.otp = newRide.generateOtp();
    await newRide.save();

    res.status(201).json({
      "rideId": newRide._id,
      ...newRide._doc
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({"message": "Internal Server Error."});
  }

};

export const assignCaptain = async (req, res) => {
  const { rideId, otp } = req.body;
  const { _id : captainId } = req.user;

  if(!rideId || !captainId || !otp) {
    res.status(400).json({"message": "rideId and captainId and OTP required."});
  }

  try {
    const rideRequest = await Ride.findById(rideId);
    if(!rideRequest.compareOtp(otp)) {
      return res.status(400).json({"message": "Invalid OTP."});
    }
    rideRequest.captain = captainId;
    rideRequest.status = "ACCEPTED";
    await rideRequest.save();

    res.status(200).json({"message": "Captain assigned successfully."});
  }
  catch (error) {
    console.error("captain assign error: ", error);
    res.status(500).json({"message": "Internal Server Error."});
  }
};


export const cancelRideCustomerSide = async (req, res) => {
  const { _id : rideId } = req.body;
  if(!rideId) {
    res.status(400).json({"message": "_id required."});
  }

  try {
    const rideRequest = await Ride.findById(rideId);
    if(!rideRequest) {
      res.status(404).json({"message": "Ride not found."});
    }
    await Ride.findByIdAndDelete(rideId);
    res.status(200).json({"message": "Ride cancelled successfully."});
  }
  catch(error) {
    console.error(error);
    res.status(500).json({"message": "Internal Server Error."});
  }
};

export const getAllRidesForCaptain = async (req, res) => {
  const { _id : captainId } = req.user;
  if(!captainId) {
    res.status(400).json({"message": "captainId required."});
  }
  try {
    const ride = await Ride.findOne({captain : captainId});
    if(ride) {
      return res.status(401).json({"message": "Captain Active"});
    }
    const rides = await Ride.find({status : "PENDING", captain : null}).select("-otp");
    res.status(200).json(rides);
  }
  catch(error) {
    console.error(error);
    res.status(500).json({"message": "Internal Server Error."});
  }
}