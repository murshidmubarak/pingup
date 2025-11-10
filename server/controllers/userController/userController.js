import Users from "../../models/userProfileSchema.js";
import jwt from "jsonwebtoken";
import imagekit from "../../configs/imageKit.js";

// Secret key for JWT (store this in .env file in real apps)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";


const signup = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create new user
    const newUser = new Users({
      full_name,
      email,
      password,
    });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user info + token
    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        full_name: newUser.full_name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile_picture: user.profile_picture,
        isProfileComplete: user.isProfileComplete,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const completeProfile = async (req, res) => {
  const { username, bio } = req.body;

  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    user.username = username;
    user.bio = bio;
    user.isProfileComplete = true;
    await user.save();

    res.json({
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile_picture: user.profile_picture,
        isProfileComplete: user.isProfileComplete,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error("Complete profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req, res) => {

  try {
    const user = await Users.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile_picture: user.profile_picture,
        isProfileComplete: user.isProfileComplete,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateUser = async (req, res) => {
  const { username, bio, full_name, profile_picture } = req.body;

  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Update basic fields
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.full_name = full_name || user.full_name;

    // ✅ If profile_picture (base64) exists, upload to ImageKit
    if (profile_picture) {

      const uploadResponse = await imagekit.files.upload({
        file: profile_picture, // base64 string (e.g. data:image/jpeg;base64,...)
        fileName: `profile_${req.user.id}.jpg`,
        folder: "/user_profiles",
      });

      user.profile_picture = uploadResponse.url;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Update user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const searchUsers = async (req, res) => {
  try {
    const query = req.query.q; // text user typed

    if (!query) {
      return res.status(200).json([]); // return empty array if no input
    }

    // case-insensitive search
     const users = await Users.find({
       $or: [
      { username: { $regex: `^${query}`, $options: "i" } }, // starts with
      { full_name: { $regex: query, $options: "i" } }        // contains
      ]
     })
.select("username full_name profile_picture followers")
.limit(10); // return only needed fields

    res.status(200).json(users);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};




export default {
  signup,
  getCurrentUser,
  completeProfile,
  getUser,
  updateUser,
  searchUsers
};
