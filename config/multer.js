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

        return cb(null, false)
    },
})

module.exports = upload
