const express=require("express");
require("./db/mongoose");
const taskRouter = require("./router/task");
const userRouter = require("./router/user");
const app=express();
const port=process.env.PORT||3000;
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log("running in port "+port)
})

// const User = require("./models/user");
// const Task=require("./models/task");

// async function main(){
//  const user=await User.findById("5feb092b97e1093fc487a83d");
//  await user.populate("tasks").execPopulate()
//  console.log(user.tasks)
// }
// main()
