const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

/**
 * Upload a file buffer to Cloudinary
 * @param {Object} file - Multer file object
 * @param {String} folder - Cloudinary folder
 * @param {String} resourceType - image | raw | auto
 * @returns {Promise<Object>}
 */
const uploadFile = (file, folder, resourceType = "auto") => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error("No file provided."));
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,    
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};

/**
 * Delete a file from Cloudinary
 * @param {String} publicId
 */
const deleteFile = async (publicId) => {
    if (!publicId) return;

    return cloudinary.uploader.destroy(publicId);
};

module.exports = {
    uploadFile,
    deleteFile,
};