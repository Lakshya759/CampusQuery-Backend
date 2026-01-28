import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    body:{ 
        type: String, 
        required: true 
    },
    author:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    post:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post", 
        required: true 
    },
    upvotes:[
        { type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],
  },
  { timestamps: true }
);

export const Answer = mongoose.model("Answer", answerSchema);
