import Ride from "../models/ride.model.js";

export const getActiveRide = async (req, res) => {
  const {_id : userId} = req.user;

  if(!userId) {
    return res.status(400).json({"message": "userId required."});
  }
  try {
    let activeRide = await Ride.findOne({ 
      $and : [
        {
          $or : [{user : userId}, {captain : userId}]
        },
        { 
          $or : [{status: "PENDING"}, {status : "ACTIVE"}, {status: "ACCEPTED"}]
        }
      ]
    });

    if(activeRide?.status != "PENDING" && activeRide?.captain) {
      activeRide = await activeRide.populate("captain");
    }

    return res.status(200).json(activeRide);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({"message": "Internal Server Error."});
  }
};

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
    let newRide = await Ride.findOne({ 
      $and : [
        {
          $or : [{user : userId}, {captain : userId}]
        },
        { 
          $or : [{status: "PENDING"}, {status : "ACTIVE"}, {status: "ACCEPTED"}]
        }
      ]
    });

    if(newRide) {
      return res.status(402).json({"message": "pending ride exists."});
    }
    
    newRide = await new Ride({
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

export const assignCaptainForAcceptance = async (req, res) => {
  const { rideId } = req.body;
  const { captainId } = req.user;

  if(!rideId || !captainId) {
    res.status(400).json({"message": "rideId and captainId required."});
  }

  try {
    const rideRequest = await Ride.findById(rideId);
    if(!rideRequest) {
      return res.status(410).json({"message" : "Ride not available."});
    }
    rideRequest.captain = captainId;
    rideRequest.status = "ACCEPTED";
    await rideRequest.save();
    await rideRequest.populate("captain");

    res.status(200).json({"message": "Captain assigned successfully.", ...rideRequest._doc});
  }
  catch (error) {
    console.error("captain assign error: ", error);
    res.status(500).json({"message": "Internal Server Error."});
  };
}

export const assignCaptain = async (req, res) => {
  const { rideId, otp } = req.body;
  const { captainId } = req.user;

  if(!rideId || !captainId || !otp) {
    res.status(400).json({"message": "rideId and captainId and OTP required."});
  }

  try {
    const rideRequest = await Ride.findById(rideId);
    console.log(rideRequest);
    if(!rideRequest) {
      return res.status(410).json({"message" : "Ride not available."});
    }
    if(!rideRequest.compareOtp(otp)) {
      return res.status(400).json({"message": "Invalid OTP."});
    }

    rideRequest.captain = captainId;
    rideRequest.status = "ACTIVE";
    await rideRequest.save();
    await rideRequest.populate("captain", "user");

    res.status(200).json({"message": "Captain assigned successfully.", ...rideRequest._doc});
  }
  catch (error) {
    console.error("captain assign error: ", error);
    res.status(500).json({"message": "Internal Server Error."});
  }
};


export const cancelRideCustomerSide = async (req, res) => {
  const { _id : rideId } = req.body;//from req.body not req.user
  if(!rideId) {
    res.status(400).json({"message": "_id required."});
  }
  if(!req.user) {
    res.status(400).json({"message": "authentication error."});
  }

  try {
    const rideRequest = await Ride.findById(rideId);
    if(!rideRequest || rideRequest.user != req.user._id) {
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
  const { captainId } = req.user;
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