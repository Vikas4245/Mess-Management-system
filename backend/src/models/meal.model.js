import mongoose, {Schema} from "mongoose";

const mealSchema = new Schema(
    {
        mealType: { 
            type: String, 
            enum: ['breakfast', 'lunch', 'dinner'], 
            required: true
        },
        date: { 
            type: Date, 
            required: true 
        },
        menu: [
            {
                itemName: { 
                  type: String, 
                  required: true 
                },
                quantity: { 
                  type: Number, 
                  required: true 
                },
                unit: { 
                  type: String, 
                  required: true 
                }, // e.g., 'kg', 'pieces'
            },
        ],
    },
    {
        timestamps: true
    }
)

export const Meal = mongoose.model("Meal", mealSchema)