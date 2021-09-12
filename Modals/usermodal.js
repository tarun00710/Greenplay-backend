const mongoose = require('mongoose');
// const {VideoModal} =  require("../Modals/VideoModal");
const userSchema=new mongoose.Schema({
    name:{ 
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    likedvideos:[{type:mongoose.Schema.Types.ObjectId,ref:"Video"}],
    playlists:[{
        playlistName:{type:String,unique:true},
        playlistVideos:[{type:mongoose.Schema.Types.ObjectId,ref:"Video"}]
    }]
})



const User= mongoose.model('User',userSchema)

module.exports = {User}