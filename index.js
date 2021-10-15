const express =require('express');
const cors=require('cors')
const app=express();
const bodyParser = require('body-parser')
const {connectionDB}=require('./DB/mongoDB')


const PORT=process.env.PORT || 5000;


connectionDB();
app.use(cors());
app.use(bodyParser.json());
 
app.get('/',(req,res)=>res.json("hellooo"));

const videosRoutes=require('./Routes/VideosRoute');
app.use('/category',videosRoutes);

const userRoutes=require('./Routes/UserRoutes');
app.use('/user',userRoutes);

app.listen(PORT,() => console.log("your app is running at" +PORT))