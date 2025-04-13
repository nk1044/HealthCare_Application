import axios from 'axios';

const cloudinaryAxios = axios.create(); 

export const uploadMediaToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    // Check if the file is audio or image
    const resourceType = file.type.startsWith("audio") ? "video" : "image"; 

    const response = await cloudinaryAxios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: false,
      }
    );
    
    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
