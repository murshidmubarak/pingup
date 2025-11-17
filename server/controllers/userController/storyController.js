import Stories from '../../models/storySchema.js';
import Users from '../../models/userProfileSchema.js';
import fs from "fs";
import path from "path";
import imagekit from "../../configs/imageKit.js";
import jwt from "jsonwebtoken"; 

// Create a story
// const createStory = async (req, res) => {
//   try {
//     const userId = req.user.id;  // from protect middleware

//     const user = await Users.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     let media = [];

//     // If media URLs came from chunk upload
//     if (req.body.media) {
//       try {
//         media = JSON.parse(req.body.media);
//       } catch (err) {
//         console.log("Media JSON parse error:", err);
//       }
//     }


//     if (media.length === 0) {
//       return res.status(400).json({ message: "Story cannot be empty" });
//     }

//     const newStory = new Stories({
//       user: userId,
//       media,
//       createdAt: Date.now(),
//     });

//     await newStory.save();

//     return res.status(201).json({ success: true, story: newStory });
//   } catch (err) {
//     console.error("Error creating story:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

const createStory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Parse media (JSON string)
    let media = [];
    if (typeof req.body.media === "string") {
      media = JSON.parse(req.body.media);
    } else {
      media = req.body.media || [];
    }


    if (!media.length) {
      return res.status(400).json({
        success: false,
        message: "Media is required",
      });
    }

    const newStory = new Stories({
      user: userId,
      // caption: req.body.caption || "",
      media: media,
      viewers: [],
    });

    const savedStory = await newStory.save();

    return res.status(201).json({
      success: true,
      story: savedStory,
    });

  } catch (error) {
    console.error("Error creating story:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create story",
    });
  }
};


const uploadStoryChunk = async (req, res) => {
  console.log("Uploading story chunk...");
  try {
    const { fileId, chunkIndex } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "No chunk uploaded" });

    const uploadDir = "tmp/uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const chunkPath = path.join(uploadDir, `${fileId}-${chunkIndex}`);
    fs.renameSync(req.file.path, chunkPath);

return res.status(200).json({ success: true, message: "Chunk saved" });
  } catch (err) {
    console.error("Error uploading story chunk:", err);
    res.status(500).json({ message: "Chunk upload failed" });
  }
};

const mergeStoryChunks = async (req, res) => {
  console.log("Merging story chunks...");
  try {
    const { fileId, totalChunks, fileName } = req.body;

    const uploadDir = "tmp/uploads";
    const mergedPath = path.join(uploadDir, `${fileId}-merged`);

    const writeStream = fs.createWriteStream(mergedPath);

    for (let i = 0; i < Number(totalChunks); i++) {
      const chunkPath = path.join(uploadDir, `${fileId}-${i}`);
      writeStream.write(fs.readFileSync(chunkPath));
      fs.unlinkSync(chunkPath);
    }

    writeStream.end();

    writeStream.on("finish", async () => {
      const uploaded = await imagekit.files.upload({
        file: fs.createReadStream(mergedPath),
        fileName,
        folder: "/stories",
      });

      fs.unlinkSync(mergedPath);

return res.status(200).json({
  success: true,
  url: uploaded.url
});

    });

  } catch (err) {
    console.error("Error merging story chunks:", err);
    res.status(500).json({ message: "Merge failed" });
  }
};



export default {
  createStory,
  uploadStoryChunk,
  mergeStoryChunks,
};
