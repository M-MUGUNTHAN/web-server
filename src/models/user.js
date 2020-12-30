const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const Task = require("./task");

const userSchema= new mongoose.Schema({
    name:{
        type:mongoose.Schema.Types.String,
        required:true,
        trim:true
    },
    email:{
        type:mongoose.Schema.Types.String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(val){
          if(!validator.isEmail(val)){
              throw new Error("invalid email")
          }
        }
    },
    password:{
        type:mongoose.Schema.Types.String,
        required:true,
        trim:true,
        minlength:7,
        validate(val){
            if(val.includes("password")){
                throw new Error("password should not contains 'password'")
            }
        }
    },
    age:{
      type:mongoose.Schema.Types.Number,
      default:0,
      validate(val){
       if(val<0){
           throw new Error("Age must be positive number")
       }
      }
    },
    avatar:{
        type:mongoose.Schema.Types.Buffer
    },
    tokens:[{
      token:{
          type:mongoose.Schema.Types.String,
          required:true
      }
    }]
},
{
   timestamps:true 
})

userSchema.virtual("tasks",{
    ref:"Tasks",
    localField:"_id",
    foreignField:"owner"
})

userSchema.methods.toJSON=function(){
    const user=this.toObject();
    delete user.password;
    delete user.tokens;
    delete user.__v;
    delete user._id;
    delete user.avatar;
    return user;
}

userSchema.methods.generateAuthToken=async function(){
  const token =await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
  
  this.tokens=this.tokens.concat({token})
  this.save();
  return token
}

userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error("unable to login")
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("unable to login");
    }
    return user;
}

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        console.log("password changed")
        this.password=await bcrypt.hash(this.password,8);
    }
    next();
})
userSchema.pre("remove",async function(next){
 await Task.deleteMany({owner:this._id})
next();
})
const User=mongoose.model("User",userSchema)
module.exports =User;