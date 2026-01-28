import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:{ 
        type: String, 
        required: true, 
        trim: true 
    },
    body:{ 
        type: String, 
        required: true 
    },
    author:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    tags:[
        { type: String, lowercase: true, trim: true }
    ],
    upvotes:[
        { type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],
    acceptedAnswer:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Answer" 
    },
  },
  { timestamps: true }
);

// Text index for search
postSchema.index({ title: "text", body: "text"});

export const Post = mongoose.model("Post", postSchema);
