import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const rebateSchema = new Schema(
    {   
        studentId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Student', 
            required: true 
        },
        mealType: { 
            type: String, 
            enum: ['breakfast', 'lunch', 'dinner'], 
            required: true 
        },
        date: { 
            type: Date, 
            required: true 
        },
        rebateAmount: { 
            type: Number, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['pending', 'approved', 'rejected'], 
            default: 'pending' 
        },
        blockchainTransactionHash: { 
            type: String, 
            required: false 
        },
    },
    {
        timestamps: true
    }
)

rebateSchema.plugin(mongooseAggregatePaginate)

export const Rebate = mongoose.model("Rebate", rebateSchema)




