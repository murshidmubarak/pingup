import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({

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

full_name:{
    type:String,
    // required:true
},
username:{
    type:String,
    required:true,
    unique:true
},
bio:{
    type:String,
    default:"" 
},
profile_picture:{
    type:String,
    default:"https://res.cloudinary.com/dzcmadjlq/image/upload/v1696225766/socialMedia/default_profile_oyh0v0.png"  
},
// Add profile completion field
  isProfileComplete: {
    type: Boolean,
    default: false
  },
followers:[{
    type:String,
    ref:"User"
}],
following:[{
    type:String,
    ref:"User"  
}],

},{timestamps:true},{minimize:false});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
