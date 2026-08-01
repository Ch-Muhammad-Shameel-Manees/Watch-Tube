import mongoose from "mongoose";

async function ConnectDB(){
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_SIMPLE_URI);
        console.log("Connected to MongoDB successfully!");
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default ConnectDB;