import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai =new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function main(){
    try {
        const response = await ai.interactions.create({
            model: "gemini-3.5-flash",
      input: "قول مرحباً، أنا مساعد SkillBridge الذكي.",
    
        });
        console.log(response.output_text);
    } catch (error){
        console.error("حصل خطأ:");
        console.error(error.message);

    }
}

main();