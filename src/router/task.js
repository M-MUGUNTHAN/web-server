const {Router}=require("express");
const auth = require("../middleware/auth");
const { listIndexes } = require("../models/task");
const Task = require("../models/task");
const router=new Router();

router.post("/tasks",auth,async(req,res)=>{
    const task=new Task({...req.body,owner:req.user._id});
    try{
        await task.save();
        res.status(201).send(task)
    }
    catch(e){
        console.log(e)
        res.status(400).send(e)   
    }
})

router.get("/tasks",auth,async(req,res)=>{
    const match={};
    const options={};
    const {completed,limit,skip,sort}=req.query;
    if(completed!==undefined){
        match.completed=completed==="true"
    }
    if(limit!==undefined){
     options.limit=parseInt(limit);
    }
    if(skip!==undefined){
     options.skip=parseInt(skip);
    }
    try{
       await req.user.populate({
           path:"tasks",
           match,
           options:{
               ...options,
               sort:{
                   completed:-1,
                   createdAt:-1,
               }
           }
       }).execPopulate();
        res.status(200).send(req.user.tasks)
    } 
    catch(e){
        res.status(500).send(e)    
    }
})

router.get("/tasks/:id",auth,async(req,res)=>{
    const _id=req.params.id
    try{
        const task= await Task.findOne({_id,owner:req.user._id});
        if(!task){
            return res.status(404).send()
        }
        
    res.status(200).send(task)
    }
    catch(e){
        console.log(e)
        res.status(500).send(e) 
    }
})

router.patch("/tasks/:id",auth,async(req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=["description","completed"];
    const isvalidUpdate=updates.every(update=>allowedUpdates.includes(update))
    if(!isvalidUpdate){
        return  res.status(400).send({error:"invalid updates"})
    }

    try{
       const task= await Task.findOne({_id:req.params.id,owner:req.user._id})
       if(!task){
          return res.status(404).send()
       }
       updates.forEach(update=>task[update]=req.body[update])
       await task.save()
       res.status(200).send(task)
    }
    catch(e){
        console.log(e)
       res.status(400).send(e)
    }
})

router.delete("/tasks/:id",auth,async(req,res)=>{
    try{
       const task= await Task.findOne({_id:req.params.id,owner:req.user._id});
       if(!task){
        return  res.status(404).send()
       }
       task.remove();
       res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports=router;