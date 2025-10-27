import Users from "../../models/userProfileSchema.js";
import jwt from "jsonwebtoken";

// Secret key for JWT (store this in .env file in real apps)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create new user
    const newUser = new Users({ username, email, password });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { 
         id: newUser._id,
         email: newUser.email 
      }, 
      JWT_SECRET,
      { 
        expiresIn: "7d" 
      } // token expiry
    );

    // Return user info + token
    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
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


export default{ 
  signup,
  getCurrentUser
};
