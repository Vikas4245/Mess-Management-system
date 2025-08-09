import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  const prompt = `
You are helping a college mess complaint system identify if a new complaint is similar to any existing open complaints.

✔️ Similar means: both complaints are about the **same specific issue** (e.g. both about milk being spoiled).
❌ Not similar means: even if they are both about food, they refer to **different items or problems**.

⚠️ Important:
- The complaints may be written in different **languages** (English, Hindi) or use different **wording**.
- You must understand the meaning and intent, and only say a complaint is similar if it is about the **same food item or problem**.

---

🆕 New Complaint:
Category: Food
Description: The milk is spoiled

📋 Existing Open Complaints:
1. [Food] tap not working
3. [Food] doodh is not good
2. [Food] doodh acha nahi hai

👉 Output:
- If the new complaint is similar to any above, return the **index number** (e.g., "1").
- If **no complaint is similar**, return **"None"**.
- Return **only one line** with either a number or the word "None".
`;


  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const text = result.response.text();
    if (!text) {
      console.error("⚠️ Gemini response is empty or malformed.");
    } else {
      console.log("🤖 Gemini Reply:", text.trim());
    }
  } catch (error) {
    console.error("❌ Error from Gemini:", error.message);
  }
}

testGemini();
