import mongoose from "mongoose";

const captainSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  vehicle: {
    plate: {
      type: String,
      unique: true,
      required: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    }
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  }
});

const Captain = mongoose.model("Captain", captainSchema);

export default Captain;