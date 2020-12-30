const mongoose=require("mongoose");

const taskSchema=new mongoose.Schema({
    description:{
        type:mongoose.Schema.Types.String,
        trim:true,
        required:true
    },
    completed:{
        type:mongoose.Schema.Types.Boolean,
        default:false,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
},{
    timestamps:true
})
taskSchema.methods.toJSON=function(){
    const task=this.toObject();
    delete task.__v;
    // delete task._id;
    return task
}
const Task=mongoose.model("Tasks",taskSchema);
module.exports=Task;