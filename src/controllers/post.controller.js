import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Post} from "../models/post.model.js"

const createPost =asyncHandler(async(req,res)=>{
    console.log(req.body);
    
    const {title,body,tags}=req.body
    
    

    const post=await Post.create({
        title,
        body,
        tags,
        author: req.user._id,
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                post
            },
            "Post Created Successfully"
        )
    )
})

const viewAllPost = asyncHandler(async(req,res)=>{
    const { tag, branch, page = 1, limit = 100 } = req.query;
    const filter = {};
    if (tag) filter.tags = tag;
    if (branch) filter.branch = branch;


    const posts = await Post.find(filter)
      .populate("author", "name branch")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    console.log(posts)
    if(!posts){
        throw new ApiError(404,"No post found with given tags")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            posts,
            "All the posts fetched successfully"
        )
    )

})

const viewSinglePost = asyncHandler(async(req,res)=>{
    const post = await Post.findById(req.params.id).populate("author", "name branch")

    if(!post){
        throw new ApiError(404,"No post found with given id")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            post,
            "Post Fetched Successfully"
        )
    )
})

const updatePost = asyncHandler(async(req,res)=>{
    const {id}=req.params;

    const post = await Post.findById(id)
    if(!post){
        throw new ApiError(404,"No post found with give id")
    }
    if(post.author.toString()!==req.user._id.toString()){
        throw new ApiError(404,"You are not authorized to edit the post")
    }

    const updated = await Post.findByIdAndUpdate(id, req.body, { new: true });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updated,
            "Post edited successfully"
        )
    )
})

const deletePost= asyncHandler(async(req,res)=>{
    const {id}=req.params;

    const post = await Post.findById(id)
    if(!post){
        throw new ApiError(404,"No post found with give id")
    }
    if(post.author.toString()!==req.user._id.toString()){
        throw new ApiError(404,"You are not authorized to delete the post")
    }
    await Post.findByIdAndDelete(id)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Post deleted successfully"
        )
    )
})


const viewTags = asyncHandler(async(req,res)=>{
    const { tag, branch, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (tag) filter.tags = tag;
    if (branch) filter.branch = branch;


    const posts = await Post.find(filter)
      .populate("author", "name branch")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    console.log(posts)
    if(!posts){
        throw new ApiError(404,"No post found with given tags")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            posts,
            "All the posts fetched successfully"
        )
    )

})







export {createPost,viewAllPost,viewSinglePost,updatePost,deletePost,viewTags}










