const express=require('express');
const { userCheckHandler } = require('../middlewares/userCheckHandler');
const router = express.Router();
const {User}= require('../Modals/usermodal')
router.route('/')
    .post(async(req,res)=>{
    try{ 
        const {name,email,password,confirmpassword} = req.body;
        const userCheck=await User.findOne({email:email});
    if(password !== confirmpassword)
        return res.status(422).json({error:"please enter same password"});
    if(userCheck){
        return res.status(422).json({success:false,error:"Email already registered"})
    } 
    const user =new User({email,name,password,confirmpassword});
    await user.save();
    res.status(201).json({success:true,message:"User successfully registered"});
    }catch(err) {
    res.send(err);
    }

})
.get(async (req, res) => {
    try {
        const {email,password}= req.body;
        const user = await User.findOne({email: email, password: password}).populate("likedvideos playlists.videos")
        if (user) {
            console.log(user)
            res.status(200).send({success:true,message:user})
        }
        else {
            res.send({success:false,message:"Authentication failed"})
        }
    }catch(err) {
        res.send(err);
    }
})
router.post('/:userId/liked/:videoId',userCheckHandler,async(req,res)=>{
    try{
        const{userId,videoId} = req.params
        const userLikedData=await User.findByIdAndUpdate(userId,{"$push":{likedvideos:videoId}},{new:true}).select("likedvideos")
        return res.json({success:true,userLikedData})
    }catch(e){
        return res.json({success:false,message:e})
    }
})


module.exports =router;