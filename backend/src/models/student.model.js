import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const studentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        rollno: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        discipline: { 
            type: String, 
            enum: ['CSE', 'ECE', 'ME', 'SM', 'DS'], 
            required: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        // profilePhoto: {
        //     type: String, // cloudinary url
        // },
        cardno: {
            type: Number,
            required: true,
            unique: true,
        },
        qrcode: {
            type: String,
        },
        regmess: {
            type: String, enum: ['mess1', 'mess2'], 
        },
        foodBytes: {
            type: Number,
            default: 0
        },          
        balance: { 
            type: Number,
        },   
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

studentSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

studentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            rollno: this.rollno,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
studentSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Student = mongoose.model("Student", studentSchema)