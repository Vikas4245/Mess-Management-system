import mongoose, {Schema} from "mongoose";

const attendanceSchema = new Schema(
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
        status: { 
            type: String, 
            enum: ['present', 'absent'], 
            required: true 
        },
    },
    {
        timestamps: true
    }
)

export const Attendance = mongoose.model("Attendance", attendanceSchema)