import Stories from '../../models/storySchema.js';
import Users from '../../models/userProfileSchema.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';


// Create a new story
const createStory = async(req,res)=>{

    try {
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

        const newStory = new Stories({
            user: userId,
            media,
            createdAt: new Date(),
        });


        await newStory.save();
        res.status(201).json({ success: true, story: newStory });

    } catch (error) {
        console.error("Error creating story:", error);
        res.status(500).json({ success: false, message: error.message });
    
    }
    
}


// Fetch stories for the logged-in user
const uploadStoryChunk = async (req, res) => {
    try {
     const { fileId, chunkIndex } = req.body;
     if (!req.file) {
       return res.status(400).json({ message: "No chunk uploaded" });
     }
 
     const chunkPath = path.join("tmp/uploads", `${fileId}-${chunkIndex}`);
     fs.renameSync(req.file.path, chunkPath);
 
     res.status(200).json({ message: "Chunk uploaded successfully" });
        
    } catch (error) {
        console.error("Error uploading story chunk:", error);
        res.status(500).json({ message: "Server error while uploading chunk" });
        
    }
}

const mergeStoryChunks = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}











export default {
    createStory,
    uploadStoryChunk,
    mergeStoryChunks
};



