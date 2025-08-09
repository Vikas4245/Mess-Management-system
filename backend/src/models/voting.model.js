import mongoose, {Schema} from "mongoose";

const votingSchema = new Schema(
    {
        electionId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true 
        },
        voterId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Student', 
            required: true 
        },
        candidateId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true 
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


export const Voting = mongoose.model("Voting", votingSchema)