import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Answer} from "../models/answer.model.js"

const createAnswer=asyncHandler(async (req,res)=>{

    const { postId } = req.params
    const {body} =req.body
    const userId=req.user._id
    
    

    const answer=await Answer.create({
        body:body,
        author:userId,
        post:postId,
    })


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    answer
                },
                "Answer Submitted Successfully"
            )
        )
})

const getAnswerByPost=asyncHandler(async (req,res)=>{
    const {postId} = req.params

    const answers=await Answer.find({post:postId})
    .populate("author","name branch")
    .sort({ createdAt: -1 })


    return res
    .status(200)
    .json(
        new ApiResponse(
           200,
           {
            answers
           },
           "Answer Retrived Successfully"
        )
    )
})

const toggleUpvote= asyncHandler(async (req,res)=>{
    const {answerId}=req.params
    const answer=await Answer.findById(answerId)
    const hasUpvoted=answer.upvotes.includes(req.user._id)
    let response=""
    if(hasUpvoted){
        answer.upvotes.pull(req.user._id)
        response="Upvote Has Been Removed Successfully"
        
    }
    else{
        answer.upvotes.push(req.user._id)
        response="Upvote Has Been Added Successfully"
        
    }
    await answer.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {upvotes:answer.upvotes.length},
            response
        )
    )
})

export {createAnswer,getAnswerByPost,toggleUpvote}