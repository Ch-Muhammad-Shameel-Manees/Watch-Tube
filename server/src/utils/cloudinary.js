import { v2 as cloudinary } from 'cloudinary'
import { apiError } from './index.js';
import fs from 'fs';

async function uploadToCloudinary(localFilePath){
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    try {
        const file = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        if (file) {
            fs.unlinkSync(localFilePath);
        }
        return file;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        throw new apiError(500, "Failed uploading file to Cloudinary");
    }
}

export {
    uploadToCloudinary
}