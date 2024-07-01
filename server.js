import app from './app.js';
import ConnectionToDB from './config/dbConnection.js';
import cloudinary from 'cloudinary'



const PORT=process.env.PORT || 5000

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

console.log("i am server");

app.listen(PORT,async()=>{
    await ConnectionToDB();
    console.log(`App is running at http:localhost ${PORT}`);
})

console.log("ayush");