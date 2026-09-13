import mongoose from "mongoose";

const connectionDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
    }catch(error){
        console.log(error);
    }
}

export default connectionDB;
