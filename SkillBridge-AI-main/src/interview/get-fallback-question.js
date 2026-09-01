import { interviewQuestionBank } from "../data/interview-question-bank.js";

export function getFallbackQuestion(skillName, excludedQuestionIds = []) {
  const targetSkill = String(skillName).trim().toLowerCase();
  const excludedIds = new Set(excludedQuestionIds);

  const question = interviewQuestionBank.find(
    (item) => item.skill.toLowerCase() === targetSkill && !excludedIds.has(item.id),
  );

  return question ?? null;
}
