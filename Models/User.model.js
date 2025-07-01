import mongoose from "mongoose"
import bcrypt from "bcrypt"


const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required: [true,"username is required"],
        index:true,
    },
    email:{
        type:String,
        required:[true, "email is required"],
        unique:true,
    },
    fullname:{
        type:String,
        required:[ true, "full name is requuired"]
    },

    password:{
        type:String,
        required: [true, "password is required"]
    },
    admin:{
        type:Boolean,
        required:[true,"admin required"]
    },
    refreshtoken:{
        type:String,

    },
    createdAt:{
        type:Date,
        default: new Date(),
    },
    UpdatedAt:{type:Date,
        default: new Date(),
    }
})

UserSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password,10)
    
})
const User = mongoose.model("User", UserSchema);
export default User;