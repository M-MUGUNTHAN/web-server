const express=require("express")
const app=express();
const port=process.env.PORT||3000;
app.get("/",(req,res)=>{
    res.send("<h1>hello from express</h1>")
})
app.get("/help",(req,res)=>{
    res.send("help page")
})
app.get("/about",(req,res)=>{
    res.send("about page")
})
app.listen(port,()=>{
    console.log("running in port "+port)
})
