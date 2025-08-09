import cron from "node-cron";
import { contract } from "../utils/VotingSystemContract.js";
import { Student } from "../models/student.model.js";
import { FoodByteTransaction } from "../models/foodByteTransaction.model.js";

// Schedule to run at 00:00 on the 1st of every month
cron.schedule("0 0 1 * *", async () => {
  try {
    const committee = await contract.getCurrentCommittee(); // returns array of rollnos
    for (const rollno of committee) {
      const student = await Student.findOne({ rollno });
      if (student) {
        student.foodBytes += 50;

        await FoodByteTransaction.create({
          rollno,
          amount: 50,
          type: "reward",
          description: "Monthly reward for being committee member"
        });

        await student.save();
      }
    }

    console.log("✅ Monthly FoodByte rewards distributed to committee members.");
  } catch (error) {
    console.error("❌ Error in monthly FoodByte reward distribution:", error.message);
  }
});
