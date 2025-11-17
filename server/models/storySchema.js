import mongoose from "mongoose";

// Sub-schema for media items
const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
  },
  { _id: false } // No extra ID -> lighter document
);

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
      index: true, // FAST fetch for millions of stories
    },

    media: {
      type: [mediaSchema], // ARRAY of media

    },

    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile",
        index: true, // Makes "has user seen?" fast
      },
    ],

    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      index: true,
    },
  },
  { timestamps: true }
);

// TTL index to auto-delete expired stories
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model("Story", storySchema);
export default Story;
