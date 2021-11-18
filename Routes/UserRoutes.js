const express=require('express');
const jwt = require('jsonwebtoken');
var mongoose=require('mongoose')
const { userCheckHandler } = require('../middlewares/userCheckHandler');
const router = express.Router();
const {User}= require('../Modals/usermodal')
const {authVerify} = require('../middlewares/authVerify');
const bcrypt = require('bcryptjs')


const secret = "efuhpBjqkzx2zE84IoqSVwzNakAL0McwYDMrkxVfkAyoyt0Cf9rjDwVFvwwmCYWh55ciD7HYPU5EC4cYxWMDhrZ5cnLBMgJrFBDHLzAW3ReYrQsLUd2qr6picKFl5oHxybeJU8RJRSKm8qY9ZC5NXNCZGOVSS8qAju2kQLwA9haBEWgD17QZOxbU/WY1qVM1xUfYzBIzs76oEq7x4gku6PLsnAW9oMfml0wPB2aQKIxWZjso5iWvDswLiorDnfv9hUMgjcZ5Dm4V1ciMkfu+zMrfNyRkdQZHao/aW0Zkz2hvaueAhx+n/lFZuMi0yhyOlXmHom8W3H4YhPlUztyyIw=="



router.route('/',userCheckHandler)
    .post(async(req,res)=>{
        try{ 
            const {name,email,password,confirmpassword} = req.body;
            const userCheck=await User.findOne({email:email});
        if(password !== confirmpassword)
            return res.status(422).json({error:"please enter same password"});
        if(userCheck){
            return res.status(422).json({success:false,error:"Email already registered"})
        } 
        const user = new User({email,name,password,confirmpassword});
        const userSaved = await user.save();
        res.status(201).json({ success:true , message:"User successfully registered"});
        }catch(err) {
            res.send(err.message);
      }
})

router.post('/login', async (req,res) => {
    try { 
        const {email,password} = req.body; 
        let users = await User.findOne({email: email}).populate("likedvideos playlists.playlistVideos")
        const isMatch = bcrypt.compare(password,users.password)
        if (isMatch) {
            let token = jwt.sign({userData:users},secret,{expiresIn:'24h'})
            const decoded = jwt.verify(token,secret)
           return res.status(200).json({success:true,decoded,token}) 
        }        
        return res.status(422).json({success: false,message:"User doesnt exist"})

    }catch(err) {
        res.status(500).json({success: false,message:err.message})
    }
})

//finding user using token
router.get("/userInfo",authVerify,async(req,res)=>{
    try{
          const {userID }= req.user 
          const getUser  = await User.findById(userID).populate("likedvideos playlists.playlistVideos")
          res.status(200).json({success:true,getUser})
    }catch(err) {
        console.log(err.message)
    }
})





//Liked video routes

router.post('/:userId/liked/:videoId',userCheckHandler,async(req,res)=>{
    try{

        const{userId,videoId} = req.params
        const videoLiked=await User.findById(userId).select("likedvideos");
        const videoAlreadyLiked=videoLiked.likedvideos.find((v_id)=>String(v_id)===videoId)
        
        if(videoAlreadyLiked)
            return res.status(403).json({success:true,message:"Video already exists"})

        const userLikedData=await User.findByIdAndUpdate(userId,{"$push":{likedvideos:videoId}},{new:true}).select("likedvideos")
        return res.json({success:true,userLikedData})
    }catch(e){
        return res.json({success:false,message:e})
    }
})

router.delete('/:userId/liked/:videoId',userCheckHandler,async(req,res)=>{
    try{
        const {userId,videoId} = req.params
        const userLikedData = await User.findByIdAndUpdate(userId,{ "$pull" : 
        {
            "likedvideos" :  mongoose.Types.ObjectId(videoId)
        }
    },{new:true}).select("likedvideos").populate("likedvideos")

    return res.status(200).json({success:true,userLikedData})

    }
    catch(error){
        return res.status(400).json({success:false, error:error})
    }
})    

//add a playlist or video to a playlist

router.post("/:userId/playlist/:playlistName/video/:videoId", userCheckHandler, async(req,res) =>  {

    try{
        const {userId,playlistName,videoId} = req.params
        const getUserPlaylists = await User.findOne({"_id":userId}).select("playlists");
        const playlistAlreadyExits = getUserPlaylists.playlists.find((each_playlist) => each_playlist.playlistName === playlistName)
        if(playlistAlreadyExits) 
            {
               const videoAlreadyExists = playlistAlreadyExits.playlistVideos.find((video)=> String(video) === String(videoId))
              
               if(videoAlreadyExists)
                return res.status(403).json({success:true,message:"Video already exists in playlist"})
               
                getUserPlaylists.playlists.find((each_playlist) => each_playlist.playlistName===playlistName).playlistVideos = getUserPlaylists.playlists.find((each_playlist) => each_playlist.playlistName===playlistName).playlistVideos.concat(String(videoId));    
 
               const updatedPlaylist = await getUserPlaylists.save()
                return res.status(200).json({success:true,updatedPlaylist}) 
            }

        //if playlist does not exist 
        const addPlaylist =await User.findByIdAndUpdate(userId,{ 
            "$push":{ "playlists" : [{ playlistName : playlistName, playlistVideos : [videoId]}]}
        },{new:true}).select("playlists")
        return res.status(200).json({success:true,addPlaylist})
    }catch(error){
        console.log(error)
        res.status(400).json({success:false,error})
    }
})

//remove a playlist or video from playlist

router.delete('/:userId/playlist/:playlistName',userCheckHandler,async(req, res)=>{
    try{
        //delete whole playlist
        const {userId, playlistName} = req.params
        // console.log(userId,playlistName)
        // const getUserPlaylists = await User.findByIdAndUpdate(userId,{
        //     "$pull" : {
        //         "playlists" : { playlistName : playlistName }
        //     }
        // },{new:true}).select('playlists')
        // return res.status(200).json({success:true,getUserPlaylists})
        const getUserPlaylists = await User.findOne({"_id" : userId}).select("playlists")
        getUserPlaylists.playlists = getUserPlaylists.playlists.filter((each_playlist) => String(each_playlist.playlistName) !== String(playlistName))
        const getUpdatedPlaylist = await getUserPlaylists.save()
        return res.status(200).json({success:true,getUpdatedPlaylist})
    }catch(error){
        console.log(error)
        return res.status(400).json({success:false,message:error.message})  
    }
})

//remove video from playlist

router.delete('/:userId/playlist/:playlistName/video/:videoId',userCheckHandler,async(req,res)=>{

    try{
        const {userId,playlistName,videoId} = req.params
        const getUserPlaylists = await User.findOne({"_id" : userId}).select("playlists")
        const playlistExists = getUserPlaylists.playlists.find((each_playlist) => String(each_playlist.playlistName) === String(playlistName))
        playlistExists.playlistVideos=playlistExists.playlistVideos.filter((video) => String(video) !== String(videoId))
        const updatedPlaylist =await getUserPlaylists.save()

        return res.status(200).json({success: true,updatedPlaylist})
    }
    catch(error){
        console.log(error)
        res.status(400).json({success:false,error})
    }
})


module.exports = router