const mongoose=require('mongoose')

const dbCon=async ()=>{
const db = await mongoose.connect(process.env.MONGODB_URL)
if(db){
    console.log("connection with database successfull")
}
else {
     console.log("connection with database failed")
}
}

module.exports=dbCon