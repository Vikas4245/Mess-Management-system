import mongoose, {Schema} from "mongoose";

const tokenSchema = new Schema(
    {
        name: { 
            type: String, required: true 
        },  
        qrcode: {
            type: String,
        },
        amount: { 
            type: Number, required: true 
        }, 
        totalTokens: { 
            type: Number, required: true 
        }, 
        remainingUses: { 
            type: Number, required: true 
        },
    },
    {
        timestamps: true
    }
)

export const Token = mongoose.model("Token", tokenSchema)



