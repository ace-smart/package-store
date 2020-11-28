const multer = require("multer")
const storage = multer.memoryStorage()

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            if(file.fieldname === 'avatar'){
                cb(null, 'tmp/avatar')
            }else if (file.fieldname === 'productImg') {
                cb(null, 'tmp/productImg')
            }
        },
        filename: function (req, file, cb) {
            const fileExtension = file.originalname.split(".")[1]
            if(file.fieldname === 'avatar'){
                cb(null, req.body.userId + '.' + fileExtension)
            }else if (file.fieldname === 'productImg') {
                if(req.body.imageName) {
                    cb(null, req.body.imageName + '.' + fileExtension)
                } else {
                    cb(null, req.body.productId +  Date.now() +  '.' + fileExtension)
                }
            }
        }
      }),
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png"
        ) {
            return cb(null, true)
        }
        return cb(
            {
                message: "Not image extension (*.jpeg/png/jpg)",
                type: "AvatarError",
                field: file.fieldname,
                file_name: file.originalname,
                file_type: file.mimetype.split("/")[1],
                file: file
            },
            false
        )
    },
    limits: {
        fileSize: 1048576, // 1Mb
    },
})

module.exports = upload
