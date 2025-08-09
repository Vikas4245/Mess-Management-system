import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const staffSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        staffid: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        }, 
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

staffSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

staffSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

staffSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            staffid: this.staffid,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
staffSchema.methods.generateRefreshToken = function(){
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

export const Staff = mongoose.model("Staff", staffSchema)