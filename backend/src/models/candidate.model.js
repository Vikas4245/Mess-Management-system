import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const candidateSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        electionId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true 
        },
        votes: { 
            type: Number, 
            default: 0 
        },
    }, 
    {
        timestamps: true
    }
)

export const Candidate = mongoose.model("Candidate", candidateSchema)