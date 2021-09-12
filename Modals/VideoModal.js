const mongoose = require('mongoose');
const VideoSchema=new mongoose.Schema({
    v_id:{
        type: String,
        required:true
    },
    category:{
        type: String,
        required:true
    },
    avatar:{
        type: String,
        required:true
    },
    title:{
        type: String,
        required:true
    },
    likes:{
        type: String,
        required:true
    },
    views:{
        type: String,
        required:true
    },
    dislikes:{
        type: String,
        required:true
    },
    channel:{
        type: String,
        required:true
    }, 
    postedOn:{
        type: String,
        required:true
    },
    subscriber:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const Video = mongoose.model('Video',VideoSchema);

module.exports = {Video};