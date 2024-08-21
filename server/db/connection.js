import mongoose from 'mongoose';

const connection = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected to ${con.connection.host}`);
        
        
    } catch (error) {
        console.log("Error while connecting to the database", error);
        
    }
}
export default connection;