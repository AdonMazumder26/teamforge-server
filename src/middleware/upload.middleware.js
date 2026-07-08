const multer = require("multer");

// Store files in memory (no local storage)
const storage = multer.memoryStorage();

/**
 * Image upload middleware
 */
const imageUpload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                )
            );
        }

        cb(null, true);
    },
});

/**
 * Resume upload middleware
 */
const resumeUpload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(
                new Error("Only PDF resumes are allowed.")
            );
        }

        cb(null, true);
    },
});

module.exports = {
    imageUpload,
    resumeUpload,
};