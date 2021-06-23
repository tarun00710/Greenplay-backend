const {User}= require('../Modals/usermodal');
const userCheckHandler=async(req,res,next)=>{
    try{
        const {userId}=req.params 
        const user=await User.findById(userId);
        if(!user) return res.json({success: false, message: "User not found"})
        req.user=user
}catch(e){res.send({success: false, message:e})}
next();
}
module.exports ={userCheckHandler}

