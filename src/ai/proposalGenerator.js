// AI Proposal Generator - قالب ذكي بيولّد Proposal مبني على مهارات وخبرة الطالب ومتطلبات المشروع
// MVP: مبني على قوالب نصية (Template-Based) مفيش أي API مدفوع

const generateProposal = ({ studentName, studentSkills = [], studentBio = '', project }) => {
  const matchedSkills = (project.skillsRequired || []).filter((skill) =>
    studentSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );

  const skillsLine = matchedSkills.length
    ? `عندي خبرة مباشرة في ${matchedSkills.join('، ')}، وده بيخليني قادر أنفذ المشروع ده بكفاءة.`
    : `عندي مهارات قريبة من متطلبات المشروع وجاهز أتعلم أي حاجة ناقصة بسرعة.`;

  const bioLine = studentBio ? `${studentBio.trim()} ` : '';

  const proposalText = `السلام عليكم،

أنا ${studentName || 'طالب على منصة SkillBridge'}. ${bioLine}اطلعت على تفاصيل مشروع "${project.title}" ومتحمس أشتغل عليه.

${skillsLine}

خطة العمل المقترحة:
1. مراجعة المتطلبات بالتفصيل والتواصل لتوضيح أي نقطة غامضة.
2. تنفيذ المشروع على مراحل واضحة مع تحديثات دورية.
3. اختبار وتسليم نهائي مطابق للمواصفات في الميعاد المتفق عليه.

الميزانية المقترحة: ${project.budget ? project.budget + ' جنيه' : 'قابلة للتفاوض حسب النطاق النهائي'}.

في انتظار ردكم للبدء فورًا.`;

  return {
    proposalText,
    matchScorePercent: project.skillsRequired?.length
      ? Math.round((matchedSkills.length / project.skillsRequired.length) * 100)
      : 0,
  };
};

module.exports = { generateProposal };
