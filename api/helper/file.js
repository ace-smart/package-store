const multer = require("multer")

module.exports = {
  // @desc:   Get image file
  _getAvatar: (req, res, next) => {
    // const upload = require("../../config/multer").fields([{ name: "avatar", maxCount: 1 }])
    const upload = require("../../config/multer").single("avatar")
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({
          type: "FileError",
          error: {
            message: err.message,
            field: err.field,
          },
        })
      } else if (err) return res.status(500).json({ error: err })

      return next()
    })
  },
}