// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';
// dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_USER_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_USER_SECRET
// });

// export const uploadFile = async (filePath) => {
//     return await cloudinary.uploader.upload(filePath, {
//         folder: 'blog_images'
//     });
// };

// export const extractImageURLs = async (html) => {
//     const regex = /<img[^>]+src="([^">]+)"/g;
//     const urls = [];
//     let match;
//     while ((match = regex.exec(html)) !== null) {
//         urls.push(match[1]);
//     }
//     return urls;
// }

// export const getCloudinaryPublicId = async (url) => {
//     const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)\./);
//     return matches && matches[1] ? matches[1] : null;
// }

// export const deleteCloudinaryImages = async (imageUrls = []) => {
//     for (const url of imageUrls) {
//         const publicId = await getCloudinaryPublicId(url);
//         if (publicId) {
//             try {
//                 await cloudinary.uploader.destroy(publicId);
//                 console.log(`Deleted: ${publicId}`);
//             } catch (err) {
//                 console.error(`Error deleting image ${publicId}:`, err);
//             }
//         }
//     }
// }

// export const deleteImageFromCloudinary = async (imageUrls) => {
//     try {
//         const publicId = await getCloudinaryPublicId(imageUrls);
//         if (!publicId) {
//             console.warn('No valid Cloudinary public ID found.');
//             return false;
//         }

//         const result = await cloudinary.uploader.destroy(publicId);
//         if (result.result === 'ok' || result.result === 'not found') {
//             console.log(`Deleted image: ${publicId}`);
//             return true;
//         } else {
//             console.warn('Unexpected response from Cloudinary destroy:', result);
//             return false;
//         }
//     } catch (error) {
//         console.error('Error deleting image from Cloudinary:', error);
//         return false;
//     }
// }
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_USER_SECRET,
});

export const uploadFile = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'blog_images',
  });
};

// ✅ Utility to extract image URLs from HTML content
export const extractImageURLs = (html = '') => {
  const regex = /<img[^>]+src="([^">]+)"/g;
  const urls = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
};

// ✅ Handles folder paths like blog_images/abc123
export const getCloudinaryPublicId = (url = '') => {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1]; // e.g., image.jpg
    const folderPath = parts.slice(parts.indexOf('upload') + 1, parts.length - 1).join('/');
    const publicId = filename.split('.')[0];
    return folderPath ? `${folderPath}/${publicId}` : publicId;
  } catch (err) {
    console.error('Error extracting publicId:', err);
    return null;
  }
};

// ✅ Delete a single image
export const deleteImageFromCloudinary = async (url) => {
  const publicId = getCloudinaryPublicId(url);
  if (!publicId) {
    console.warn('No valid Cloudinary public ID found.');
    return false;
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok' || result.result === 'not found') {
      console.log(`Deleted image: ${publicId}`);
      return true;
    } else {
      console.warn('Unexpected response from Cloudinary destroy:', result);
      return false;
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

// ✅ Delete an array of images
export const deleteCloudinaryImages = async (imageUrls = []) => {
  for (const url of imageUrls) {
    await deleteImageFromCloudinary(url);
  }
};
