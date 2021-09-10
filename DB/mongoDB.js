const mongoose = require('mongoose');
const mongoURL="mongodb+srv://Greenplay:Tkat%40007@cluster0.xmac2.mongodb.net/myGreenplay?authSource=admin&replicaSet=atlas-goc8kx-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"
const connectionDB=async()=>{
    try{
        const connect=await mongoose.connect(mongoURL, { useNewUrlParser: true , useUnifiedTopology: true ,useFindAndModify:false})
        if(connect)
            console.log("connected to DB");
        else
            console.log("Couldn't connect to MongoDB");
    }
    catch(error){
        console.log(error);
    }
}
module.exports={connectionDB}

