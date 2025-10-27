import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

  email: {
    type: String,
     unique: true, 
    },

  phone: { 
    type: String, 
    unique: true, 
    sparse: true, 
 },

  password: {
     type: String,
      required: true 
    },

  emailVerified: {
     type: Boolean,
     default: false 
    },

  phoneVerified: {
     type: Boolean,
      default: false
     },
});


const User = mongoose.model("User", userSchema);

export default User;
