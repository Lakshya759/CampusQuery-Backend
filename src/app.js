import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/ApiError.js";
const app=express();


app.use(cors({
    origin:true,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import answerRouter from "./routes/answer.routes.js"

//routes declaration

app.use("/api/v1/users",userRouter)
app.use("/api/v1/posts",postRouter)
app.use("/api/v1/answer",answerRouter)

app.get("/", (req, res) => {
  res.send("Backend is live");
});
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
  

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export {app}