"use client";

import toast from "react-hot-toast";
import { UploadProfileImageResponse } from "@/app/api/image-upload/route";

export const TestImageUpload = () => {

    const handleSelectedFileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target && e.target.files && e.target.files[0];
        if (!file) throw new Error('No file selected')
        const { imageUrl } = await uploadImage(file);
        toast.success('Image uploaded!');
    }

    const uploadImage = async (file: File) => {
        const body = new FormData();
        body.set('image', file);
      
        const response = await fetch('/api/image-upload', {
            method: 'POST',
            body,
        });
      
        if (!response.ok) {
            toast.error('Error uploading profile image');
            throw new Error('Error uploading profile image');
        }
      
        const result: UploadProfileImageResponse = await response.json();
        if (!result) throw new Error('Error uploading profile image')
        return result;
    }

    return(
        <input 
            type="file" 
            accept="image/png, image/jpeg, image/webp" 
            className='border border-gray-200 p-2 rounded mb-2 text-slate-700' 
            onChange={(e) => handleSelectedFileImageChange(e)} 
        />

        // <ImageFileInput 
        //     label='Image' 
        //     name='fileInput' 
        //     options={{ 
        //         required: false,
        //         onChange: (e) => handleSelectedFileImageChange(e),
        //     }}  
        // />
    )
}