import { Schema, model } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
const BasicSchema=new Schema(
    {
        companyLogo:{
            public_id:{
                type:String,
            },
            secure_url:{
                type:String,
            }
        },
        companyName:{
            type:String,
            default:""
        },
        companyOwner:{
            type:String,
            default:""
        },
        phoneNumber:{
            type:Number,
            required:true,
            unique:true
        },
        whastappNumber:{
            type:Array,
            default:[]
        },
        address:{
            type:Array,
            default:[]
        },
        email_id:{
            type:Array,
            default:[]
        },
        aboutUs:{
            type:String,
            default:""
        },
        isActive:{
            type:String,
            enum:["ACTIVE","DEACTIVE"],
            default:"ACTIVE"
        },
        isPaid:{
            type:String,
            enum:["FREE","PAID"],
            default:"FREE"
        },
        token:{
            type:String,
            default:""
        }        
    },
    {
        timestamps:true
    }
)


BasicSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password=await bcrypt.hash(this.password,10)
    return next()
})

BasicSchema.methods={
    generateJWTToken:async function(){
        return await jwt.sign(
            {id:this._id,userName:this.userName},
            process.env.SECRET,
            {
                expiresIn:'24h'
            }
        ) 
    },
    comparePassword:async function(plaintextPassword){
       return await bcrypt.compare(plaintextPassword,this.password)
    },
}



const BasicInfo=model('BASICINFOCOMPANY',BasicSchema)

export default BasicInfo