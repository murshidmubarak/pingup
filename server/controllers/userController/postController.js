import Users from "../../models/userProfileSchema.js";
import jwt from "jsonwebtoken";
import imagekit from "../../configs/imageKit.js";
import Post from "../../models/postSchema.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const createPost = async (req, res) => {
  console.log("Creating post...");
  try {
    const userId = req.user.id;
    const description = req.body.content || "";

    let media = [];

    // case 1: chunk upload passed as URLs
if (req.body.media) {
  try {
    media = JSON.parse(req.body.media);
  } catch (err) {
    console.log("Media parse error:", err);
    media = [];
  }
}


    // case 2: normal image upload
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await imagekit.files.upload({
          file: file.buffer.toString("base64"),
          fileName: file.originalname,
          folder: "/posts",
        });

        media.push({
          url: uploaded.url,
          type: file.mimetype.startsWith("video/") ? "video" : "image"
        });
      }
    }

    const post = new Post({ user: userId, description, media });
    await post.save();

    res.status(201).json({ post });

  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
};

 const uploadChunk = (req, res) => {
  console.log("Uploading chunk...");
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
  console.log("Merging chunks...");
  try {
    const { fileId, totalChunks, fileName } = req.body;

    const mergedFilePath = path.join("tmp/uploads", `${fileId}-merged`);
    const writeStream = fs.createWriteStream(mergedFilePath);

    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join("tmp/uploads", `${fileId}-${i}`);
      const chunk = fs.readFileSync(chunkPath);
      writeStream.write(chunk);
      fs.unlinkSync(chunkPath);
    }

    writeStream.end();

    writeStream.on("finish", async () => {
      const uploaded = await imagekit.files.upload({
        file: fs.createReadStream(mergedFilePath),
        fileName,
        folder: "/posts",
      });

      fs.unlinkSync(mergedFilePath);

      return res.status(200).json({
        message: "Merged file uploaded",
        url: uploaded.url
      });
    });

  } catch (error) {
    res.status(500).json({ message: "Error merging chunks" });
  }
};





const LIMIT = 10;

//  const fetchFeedPosts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const skip = (page - 1) * LIMIT;
//     // console.log(`Fetching posts for page=${page}, skip=${skip}, limit=${LIMIT}`);


//     const posts = await Post.find({ isDeleted: false })
//       .populate("user", "full_name username profile_picture")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(LIMIT)
//       .lean();

//     const totalCount = await Post.countDocuments({ isDeleted: false });
//     const hasMore = skip + posts.length < totalCount;

//     res.status(200).json({
//       posts,
//       hasMore,
//     });
//   } catch (error) {
//     console.log("Error fetching feed posts:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// const fetchFeedPosts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const skip = (page - 1) * LIMIT;

//     const posts = await Post.aggregate([
//       { $match: { isDeleted: false } },
//       { $sort: { createdAt: -1 } },
//       { $skip: skip },
//       { $limit: LIMIT },

//       //  Lookup user details
//       {
//         $lookup: {
//           from: "userprofiles", // 🔹 must match your Mongo collection name (lowercase plural of model)
//           localField: "user",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: "$user" },

//       // ✅ Project only needed fields (lightweight + fast)
//       {
//         $project: {
//           _id: 1,
//           description: 1,
//           media: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           "user._id": 1,
//           "user.username": 1,
//           "user.full_name": 1,
//           "user.profile_picture": 1,
//           likeCount: { $size: "$likes" },
//           commentCount: { $size: "$comments" },
//         },
//       },
//     ]);

//     // ✅ Get total post count for pagination
//     const totalCount = await Post.countDocuments({ isDeleted: false });
//     const hasMore = skip + posts.length < totalCount;

//     res.status(200).json({ success: true, posts, hasMore });
//   } catch (error) {
//     console.error("Error fetching feed posts:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };






// const toggleLikeOnPost = async (req, res) => {
//   console.log("Toggling like on post (optimized)...");
//   try {
//     const postId = req.params.postId;
//     const userId = new mongoose.Types.ObjectId(req.user.id);

//     // ✅ Check if already liked using Mongo only (no need to fetch full post)
//     const isLiked = await Post.exists({ _id: postId, likes: userId });

//     if (isLiked) {
//       // 🔹 Unlike (remove userId from likes array)
//       await Post.updateOne(
//         { _id: postId },
//         { $pull: { likes: userId } }
//       );
//       console.log("User unliked the post");
//     } else {
//       // 🔹 Like (add only if not already present)
//       await Post.updateOne(
//         { _id: postId },
//         { $addToSet: { likes: userId } }
//       );
//       console.log("User liked the post");
//     }

//     // ✅ Get updated like count (very lightweight query)
//     const updatedPost = await Post.findById(postId).select("likes");

//     res.status(200).json({
//       postId,
//       likes_count: updatedPost.likes.length,
//       liked: !isLiked,
//     });
//   } catch (error) {
//     console.error("❌ Error toggling like:", error);
//     res.status(500).json({ message: "Failed to toggle like" });
//   }
// };


const fetchFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * LIMIT;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const posts = await Post.aggregate([
      { $match: { isDeleted: false } },

      { $sort: { createdAt: -1 } },

      { $skip: skip },
      { $limit: LIMIT },

      {
        $lookup: {
          from: "userprofiles",
          localField: "user",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                username: 1,
                full_name: 1,
                profile_picture: 1,
              }
            }
          ],
          as: "user"
        }
      },
      { $unwind: "$user" },

      {
        $addFields: {
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
          isLiked: { $in: [userId, "$likes"] }
        }
      },

      {
        $project: {
          _id: 1,
          description: 1,
          media: 1,
          createdAt: 1,
          "user._id": 1,
          "user.username": 1,
          "user.full_name": 1,
          "user.profile_picture": 1,
          likeCount: 1,
          commentCount: 1,
          isLiked: 1
        }
      }
    ]).allowDiskUse(true); 

    // Pagination
    const totalCount = await Post.countDocuments({ isDeleted: false });
    const hasMore = skip + posts.length < totalCount;

    res.status(200).json({
      success: true,
      posts,
      hasMore
    });

  } catch (error) {
    console.error("Error fetching feed posts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const fetchUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ user: userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(posts);
    
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



const toggleLikeOnPost = async (req, res) => {

  try {
    const postId = new mongoose.Types.ObjectId(req.params.postId);
    const userId = new mongoose.Types.ObjectId(req.user.id);

    //  Try to unlike first (atomic operation)
    const unlikeResult = await Post.updateOne(
      { _id: postId, likes: userId },
      { 
        $pull: { likes: userId },
        $inc: { likeCount: -1 } // if you store likeCount in schema (recommended)
      }
    );

    if (unlikeResult.modifiedCount > 0) {
      return res.status(200).json({ postId, liked: false });
    }

    const likeResult = await Post.updateOne(
      { _id: postId, likes: { $ne: userId } },
      { 
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 } // increment counter
      }
    );

    if (likeResult.modifiedCount > 0) {
      console.log(" User liked the post");
      return res.status(200).json({ postId, liked: true });
    }

    res.status(404).json({ message: "Post not found or not updated" });

  } catch (error) {
    console.error("❌ Error toggling like:", error);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};



export default{ 
  createPost,
  uploadChunk,
  mergeChunks,
  fetchFeedPosts,
  toggleLikeOnPost,
  fetchUserPosts
};
