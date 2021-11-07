const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
        playlistName:{type:String,},
        playlistVideos:[{type:mongoose.Schema.Types.ObjectId,ref:"Video"}]
    }]
})



userSchema.pre('save',async function (next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password,12)
    }
    next()
})

const User= mongoose.model('User',userSchema)

module.exports = {User}