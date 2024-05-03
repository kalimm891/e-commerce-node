const multer = require("multer")
const path = require("path")




var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        if (file.mimetype == "image/jpeg" || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            console.log("Fine")
        }else{
            cb(new Error('Unsupported File'), false)
        }
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype == "image/jpeg") {
                cb(null, path.join(__dirname, '../upload/image'))
            } 
            
        
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname))
    },
})

var upload = multer({
    storage: storage,
    limits:{
        fieldSize: 1024 * 1024 * 10
    },
})


module.exports = {
    upload: upload
}