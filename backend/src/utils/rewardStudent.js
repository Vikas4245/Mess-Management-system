import { Student } from "../models/student.model.js";

export const rewardStudentWithFoodByte = async (rollno) => {
    const student = await Student.findOne({ rollno });
    if (student) {
        student.foodBytes = (student.foodBytes || 0) + 1;
        await student.save();
    }
};
