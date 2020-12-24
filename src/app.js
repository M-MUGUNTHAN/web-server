const express=require("express")
const app=express();
app.get("/",(req,res)=>{
    res.send("<h1>hello from express</h1>")
})
app.get("/help",(req,res)=>{
    res.send("help page")
})
app.listen(3000,()=>{
    console.log("running in port 3000")
})