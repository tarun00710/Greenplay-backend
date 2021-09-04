const express=require('express');
var mongoose=require('mongoose')
const { userCheckHandler } = require('../middlewares/userCheckHandler');
const router = express.Router();
const {User}= require('../Modals/usermodal')



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
    const user =new User({email,name,password,confirmpassword});
    await user.save();
    res.status(201).json({success:true,message:"User successfully registered"});
    }catch(err) {
    res.send(err);
    }
})

router.post('/login',async (req, res) => {
    try { 
        const {email,password} = req.body;
        const user = await User.findOne({email: email, password: password}).populate("likedvideos playlists.videos")
        if (user) {
           return res.status(200).json({success:true,user}) 
        }        
        return res.json({success: false,message:"User doesnt exist"})
        
    }catch(err) {
        res.status(500).json({success: false,message:"Unable to login"})
    }
})

//Liked video routes

router.post('/:userId/liked/:videoId',userCheckHandler,async(req,res)=>{
    try{
        const{userId,videoId} = req.params
        const videoLiked=await User.findById(userId).select("likedvideos");
        const videoAlreadyLiked=videoLiked.likedvideos.find((v_id)=>String(v_id)===videoId)
        
        if(videoAlreadyLiked)
            return res.json({success:true,message:"Video already exists"})

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

    }catch(error){
        return res.status(400).json({success:false, error:error})
    }
})    

//add a playlist or video to a playlist

router.post("/:userId/playlist/:playlistName/video/:videoId",userCheckHandler,async(req,res) =>  {

    try{
        const {userId,playlistName,videoId} = req.params

        //get user
        const getUserPlaylists = await User.findOne({"_id":userId}).select("playlists");
        const playlistAlreadyExits = getUserPlaylists.playlists.find((each_playlist) => each_playlist.playlistName === playlistName)

        if(playlistAlreadyExits) 
            {
               const videoAlreadyExists = playlistAlreadyExits.videos.find((video)=> String(video) === String(videoId))
              
               if(videoAlreadyExists)
                return res.status(200).json({success:true,message:"Video already exists in playlist"})
               
                getUserPlaylists.playlists.find((each_playlist) => each_playlist.playlistName===playlistName).videos = getUserPlaylists.playlists.find((each_playlist) => each_playlist.playlistName===playlistName).videos.concat(String(videoId));    
 
               const updatedPlaylist = await getUserPlaylists.save()
                return res.status(200).json({success:true,updatedPlaylist}) 
            }

        //if playlist does not exist 
        const addPlaylist =await User.findByIdAndUpdate(userId,{ 
            "$push":{ "playlists" : [{ playlistName : playlistName,videos : [videoId]}]}
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
        const getUserPlaylists = await User.findByIdAndUpdate(userId,{
            "$pull" : {
                "playlists" : { playlistName : playlistName }
            }
        },{new:true}).select('playlists')

        return res.status(200).json({success:true,getUserPlaylists})

    }catch(error){
        return res.status(400).json({success:false,message:error.message})
    }
})

//remove video from playlist

router.delete('/:userId/playlist/:playlistName/video/:videoId',userCheckHandler,async(req,res)=>{

    try{
        const {userId,playlistName,videoId} = req.params
        const getUserPlaylists = await User.findOne({"_id" : userId}).select("playlists")

        const playlistExists = getUserPlaylists.playlists.find((each_playlist) => String(each_playlist.playlistName)===String(playlistName))
        playlistExists.videos=playlistExists.videos.filter((video) => String(video) !== String(videoId))

        const updatedPlaylist =await getUserPlaylists.save()

        return res.status(200).json({success: true,updatedPlaylist})
    }
    catch(error){
        console.log(error)
        res.status(400).json({success:false,error})
    }
})


module.exports = router