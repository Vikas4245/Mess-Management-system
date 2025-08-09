import mongoose, {Schema} from "mongoose"

const complaintSchema = new Schema(
    {
        studentId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Student', 
            required: true 
        },
        title: { 
            type: String, 
            required: true 
        },
        description: {
            type: String, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['submitted', 'in-progress', 'resolved'], 
            default: 'submitted' 
        },
        blockchainTransactionHash: { 
            type: String, 
            required: false 
        }, // Optional reference to BlockchainLog
    }, 
    {
        timestamps: true
    }
)



export const Complaint = mongoose.model("Complaint", complaintSchema)