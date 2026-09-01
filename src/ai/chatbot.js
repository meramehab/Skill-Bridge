const Chatbot = require('../models/Chatbot');

// In-House Chatbot بسيط بقواعد (Rule-Based) - MVP من غير أي API خارجي مدفوع
// كل الداتا محفوظة في قاعدة البيانات بتاعتنا فقط
const INTENT_RULES = [
  { intent: 'greeting', keywords: ['مرحبا', 'اهلا', 'السلام عليكم', 'hello', 'hi', 'هاي'] },
  { intent: 'about', keywords: ['ايه هي', 'عن المنصة', 'about', 'ايه دي المنصة', 'skillbridge'] },
  { intent: 'projects', keywords: ['مشروع', 'مشاريع', 'project'] },
  { intent: 'skills', keywords: ['مهارة', 'مهارات', 'skill'] },
  { intent: 'payment', keywords: ['دفع', 'فلوس', 'payment', 'سعر', 'تكلفة'] },
  { intent: 'help', keywords: ['مساعدة', 'help', 'مشكلة'] },
  { intent: 'squad', keywords: ['فريق', 'squad', 'team'] },
  { intent: 'dispute', keywords: ['نزاع', 'شكوى', 'dispute', 'مشكلة مع'] },
  { intent: 'farewell', keywords: ['باي', 'مع السلامة', 'bye', 'شكرا وسلام'] },
];

const RESPONSES = {
  greeting: 'أهلاً بيك في SkillBridge! إزاي أقدر أساعدك النهاردة؟',
  about: 'SkillBridge هي منصة فريلانسنج للطلاب، بتساعدهم يلاقوا مشاريع ويطوروا مهاراتهم.',
  projects: 'تقدر تستعرض المشاريع المتاحة من صفحة "المشاريع" في المنصة، وتقدر تقدم على أي مشروع يناسب مهاراتك.',
  skills: 'تقدر تضيف مهاراتك في صفحة البروفايل بتاعك عشان تظهرلك مشاريع مناسبة أكتر.',
  payment: 'كل المدفوعات بتتم بشكل آمن من خلال المنصة، وتقدر تراجع تفاصيل الدفع من صفحة "المحفظة".',
  help: 'أكيد، احكيلي مشكلتك بالتفصيل وهحاول أساعدك، أو تقدر تتواصل مع فريق الدعم مباشرة.',
  squad: 'الفرق (Squads) بتخلي الطلاب يشتغلوا مع بعض على مشاريع أكبر. تقدر تنضم أو تعمل فريق من صفحة "Squads".',
  dispute: 'لو فيه نزاع أو مشكلة في مشروع، تقدر تفتح تذكرة نزاع من صفحة المشروع وفريقنا هيراجعها.',
  farewell: 'شكرًا لتواصلك معنا! لو احتجت أي حاجة تانية، أنا موجود.',
  unknown: 'معلش، مفهمتش قصدك بالظبط. ممكن توضح أكتر أو تسأل بطريقة تانية؟',
};

class SimpleChatbot {
  classifyIntent(message) {
    const text = message.toLowerCase();
    for (const rule of INTENT_RULES) {
      if (rule.keywords.some((k) => text.includes(k.toLowerCase()))) {
        return rule.intent;
      }
    }
    return 'unknown';
  }

  async getResponse(message, userId, sessionId) {
    try {
      let chatSession = await Chatbot.findOne({ userId, sessionId });
      if (!chatSession) {
        chatSession = new Chatbot({ userId, sessionId, messages: [], context: {} });
        await chatSession.save();
      }

      const intent = this.classifyIntent(message);
      const botResponse = RESPONSES[intent] || RESPONSES.unknown;

      chatSession.messages.push(
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'bot', content: botResponse, timestamp: new Date(), intent }
      );

      const existing = chatSession.trainingData.find((t) => t.question === message);
      if (existing) {
        existing.usedCount += 1;
      } else {
        chatSession.trainingData.push({
          question: message,
          answer: botResponse,
          intent,
          category: 'general',
        });
      }

      await chatSession.save();

      return { response: botResponse, intent, confidence: 70 };
    } catch (error) {
      console.error('Chatbot error:', error);
      return {
        response: 'عذراً، حدث خطأ في معالجة طلبك. حاول مرة أخرى.',
        intent: 'error',
        confidence: 0,
      };
    }
  }

  // مكان مخصص لتحسين/تدريب البوت بناءً على بيانات الاستخدام الفعلية لاحقًا
  async trainWithUserData(userId) {
    return;
  }
}

module.exports = new SimpleChatbot();
