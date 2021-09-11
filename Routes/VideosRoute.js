const express=require('express');
const router=express.Router();
const VideosDB=require('../DB/VideosDB');
const {VideoModal}=require('../Modals/VideoModal');

router.route("/")
.get(async(req,res)=>{
    try{
        console.log("do it")
        const Videos=await VideoModal.find({});
        console.log(Video)
        res.json({success:true,Videos});
    }
    catch(error){
        res.status(500).json({success:false,error});
    }
})
.post(async(req,res)=>{
    try{
        VideosDB.forEach((ele)=>{
            const video=new VideoModal(ele);
           video.save();
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
    console.log(v_id)
    const video=await VideoModal.find({"_id": v_id})
    res.send({success:true,video:video})
}catch(error){
    res.status(404).json({success:false,messgage:error})
}
})



module.exports=router;