const mongoose = require('mongoose');
const {VideoModal}=require('../Modals/VideoModal')
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
    likedvideos:[{type:mongoose.Schema.Types.ObjectId,ref:VideoModal}],
    playlists:[{
        playlist:{type:String},
        videos:{type:mongoose.Schema.Types.ObjectId,ref:VideoModal}
    }]
})

const User= mongoose.model('USER',userSchema)

module.exports = {User}