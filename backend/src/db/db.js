import mongoose from "mongoose";

const MONGO_URI=process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log(connection?.connection.host)
  }
  catch (err) {
    console.log("mongo connection error", err);
    throw new Error(err?.message);
  }
}

export default connectDB;