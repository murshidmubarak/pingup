import Users from "../../models/userProfileSchema.js";
import jwt from "jsonwebtoken";
import imagekit from "../../configs/imageKit.js";
import Post from "../../models/postSchema.js";
import fs from "fs";
import path from "path";

const createPost = async (req, res) => {
  try {
    // Authenticate
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get description (or content)
    const description = req.body.content || req.body.description || "";

    // Process files using multer and upload to ImageKit
    let media = [];

    if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    const uploaded = await imagekit.files.upload({
      file: file.buffer.toString("base64"),
      fileName: file.originalname,
      folder: "/posts",
    });

    const type = file.mimetype.startsWith("video/") ? "video" : "image";
    
    media.push({
      url: uploaded.url,
      type,
    });
  }
}


    // Create and save post
    const newPost = new Post({
      user: userId,
      description: description,
      media,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

 const uploadChunk = (req, res) => {
  try {
    const { fileId, chunkIndex } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No chunk uploaded" });
    }

    const chunkPath = path.join("tmp/uploads", `${fileId}-${chunkIndex}`);
    fs.renameSync(req.file.path, chunkPath);

    res.status(200).json({ message: "Chunk uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error uploading chunk" });
  }
};

const mergeChunks = async (req, res) => {
  try {
    const { fileId, totalChunks, fileName } = req.body;

    const mergedFilePath = path.join("tmp/uploads", `${fileId}-merged`);
    const writeStream = fs.createWriteStream(mergedFilePath);

    // Merge chunks one by one
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join("tmp/uploads", `${fileId}-${i}`);
      const chunk = fs.readFileSync(chunkPath);
      writeStream.write(chunk);
      fs.unlinkSync(chunkPath); // remove chunk
    }
    writeStream.end();

    writeStream.on("finish", async () => {
      // ✅ Upload final merged file to ImageKit using Stream
      const uploaded = await imagekit.files.upload({
        file: fs.createReadStream(mergedFilePath),
        fileName: fileName || `${fileId}.mp4`,
        folder: "/posts",
      });

      // Remove merged file after upload
      fs.unlinkSync(mergedFilePath);

      return res.status(200).json({
        message: "File uploaded successfully",
        url: uploaded.url,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error merging chunks" });
  }
};

// const fetchFeedPosts = async (req, res) => {
//   console.log("Fetching feed posts...");
//   try {
//     const posts = await Post.find({ isDeleted: false })
//       .populate("user", "full_name username profile_picture") // FIXED HERE
//       .sort({ createdAt: -1 });

//     res.status(200).json(posts);

//   } catch (error) {
//     console.log("Error fetching posts:", error);
//     res.status(500).json({ message: "Server error fetching posts" });
//   }
// };


const LIMIT = 10;

 const fetchFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * LIMIT;
    // console.log(`Fetching posts for page=${page}, skip=${skip}, limit=${LIMIT}`);


    const posts = await Post.find({ isDeleted: false })
      .populate("user", "full_name username profile_picture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(LIMIT);

    const totalCount = await Post.countDocuments({ isDeleted: false });
    const hasMore = skip + posts.length < totalCount;

    res.status(200).json({
      posts,
      hasMore
    });
  } catch (error) {
    console.log("Error fetching feed posts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};







export default{ 
  createPost,
  uploadChunk,
  mergeChunks,
  fetchFeedPosts 
};
