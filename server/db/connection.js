import mongoose from "mongoose";

const connection = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected to ${con.connection.host}`);
    return con;
  } catch (error) {
    console.error("Error while connecting to the database", error);
    throw error;
  }
};
export default connection;
