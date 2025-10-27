// import mongoose from "mongoose";


// const connectDB = async ()=>{
//     try {
//         mongoose.connection.on('connected',()=>{
//             console.log('db connected')
//         })
//         await mongoose.connect(`${process.env.MONGODB_URI}/SOCIALMEDIA`)
//     } catch (error) {

//         console.log(error.message)
        
//     }
// }

// export default connectDB


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Listen for connection events
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("MongoDB connection error:", err);
    });

    // Connect to local MongoDB
    await mongoose.connect(`${process.env.MONGODB_URI}/SOCIALMEDIA`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
