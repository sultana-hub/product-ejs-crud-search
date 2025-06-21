
const multer=require('multer')
// const fs=require('fs')
// const path=require('path')


const storage=multer.diskStorage({
destination:(req,file,cb)=>{
     cb(null,'./uploads')
},
filename:(req,file,cb)=>{
    cb(null,Date.now()+'-'+file.originalname)
}
})
const ProductsImageUpload=multer({storage:storage})

module.exports=ProductsImageUpload
