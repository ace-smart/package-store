const multer = require("multer")
const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg"
        ) {
            return cb(null, true)
        }

        return cb(
            {
                message: "Not image extension (*.jpeg/png/jpg)",
                type: 'AvatarError',
                field: file.fieldname,
                file_name: file.originalname,
                file_type: file.mimetype.split('/')[1]
            },
            false
        )
    },
    limits: {
        fileSize: 1048576, // 1Mb
    },
})

module.exports = upload
