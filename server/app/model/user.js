const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema=new Schema({

    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    
    phone:{
        type:String,
        require:true
    },
    password:{
     type:String,
     require:true
    },
    image:{
        type:String,
        default:"image"
    },
    is_verify:{
        type:Boolean,
        default:false
    }

},
{ timestamps: true })

const userModel=mongoose.model('user',userSchema)
module.exports=userModel