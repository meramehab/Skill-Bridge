import "dotenv/config";
import { geminiClient } from "./ai/gemini-client.js";

const testModel = "gemini-3.5-flash";
const testMessage = "قول مرحباً، أنا مساعد SkillBridge الذكي.";

async function main() {
  try {
    const response = await geminiClient.models.generateContent({
      model: testModel,
      contents: testMessage,
    });

    console.log(response.text);
  } catch (error) {
    console.error("حدث خطأ أثناء تشغيل اختبار Gemini.");
    console.error(error.message);
  }
}

main();
