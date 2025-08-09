import mongoose, {Schema} from "mongoose";

const blockchainLogSchema = new Schema(
    {
        transactionHash: { 
            type: String, 
            required: true 
        },
        operation: { 
            type: String, 
            required: true 
        }, // e.g., 'addComplaint', 'vote'
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true 
        }, // Reference to Students or Staff
        timestamp: { 
            type: Date, 
            default: Date.now 
        },
        status: { 
            type: String, 
            enum: ['success', 'failed'], 
            required: true 
        },  
    }, 
    {
        timestamps: true
    }
)

export const BlockchainLog = mongoose.model("BlockchainLog", blockchainLogSchema)