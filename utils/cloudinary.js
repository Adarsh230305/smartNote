import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
// These this we get from cloudnary website
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});
// console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API KEY:", process.env.CLOUDINARY_API_KEY);
// console.log("API SECRET:", process.env.CLOUDINARY_API_SECRET);
// console.log("ACCESS TOKEN EXPIRY:", process.env.ACCESS_TOKEN_EXPIRY);
const uploadOnCloudinary=async function(localFilePath){
    try {
        if(!localFilePath) return null
        // upload the file on cloudnary
     const response= await cloudinary.uploader.upload(localFilePath,{
    resource_type:'auto'
        })
        // console.log("file is uploaded on cloudnary",response.url);
        // fs.unlinkSync(localFilePath) // remove file from local server after uploading to cloudnary
        
        return response;}
    // } catch (error) {
    //     // fs.unlinkSync(localFilePath)
        
    //     return null; /* remove the 
    //     locally saved temporary file as the file get uploaded */ 

    // }
    catch (error) {
    console.log("❌ FULL CLOUDINARY ERROR:", error);
    console.log("❌ ERROR MESSAGE:", error.message);

    if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
    }

    return null;
}
}
export {uploadOnCloudinary};


