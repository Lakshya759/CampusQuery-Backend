import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    name:{ 
        type: String, 
        required: true, 
        trim: true,
        index:true 
    },
    email:{
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password:{
        type: String, 
        required: true, 
    },
    role:{
      type: String,
      enum: ["student", "faculty", "alumni", "helper"],
      default: "student",
    },
    branch:{ 
        type: String 
    },
    year:{ 
        type: Number 
    },
    skills:[
        { type: String }
    ],
    reputation:{ 
        type: Number, 
        default: 0 
    },
    refreshToken:{ 
        type: String 
    },
    refreshToken:{
        type:String
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Password comparison method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}


userSchema.methods.generateAccessToken= function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)}

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id:this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User", userSchema)
