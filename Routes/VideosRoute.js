const express=require('express');
const router=express.Router();
const VideosDB=require('../DB/VideosDB');
const {Video}=require('../Modals/VideoModal');

router.route("/")
.get(async(req,res)=>{
    try{
        console.log("do it")
        const Videos=await Video.find({});
        console.log(Videos)
        res.json({success:true,Videos});
    }
    catch(error){
        res.status(500).json({success:false,error:error.message});
    }
})
.post(async(req,res)=>{
    try{
        VideosDB.forEach( async(ele)=>{
            const video=new Video(ele);
            const response = await video.save();
            res.json({success:true,response})
        })
    }catch(error){
        res.status(500).json({success:false,error})
    }finally{
        // Ensures that the client will close when you finish/error
        await client.close();
      }
})

router.route('/:v_id')
.get(async(req,res)=>{
    try{
    const v_id=req.params.v_id;
    
    const video=await Video.findById(v_id)
    res.send({success:true,video})
}catch(error){
    res.status(404).json({success:false,messgage:error})
}
})



module.exports=router;