import { useState } from 'react';
import useSkills from '../hooks/useSkills';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const CVAnalysis = () => {
  const { analyzing, result, error, analyzeCV } = useSkills();
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    // مهارات هدف مرجعية بسيطة لمسار Full-Stack كمثال - ممكن تتغير حسب المسار المختار
    const targetSkills = ['javascript', 'react', 'node.js', 'mongodb', 'git'];
    await analyzeCV(file, targetSkills);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <span className="eyebrow">تحليل السيرة الذاتية</span>
      <h1 className="mt-2 text-2xl font-semibold">ارفع سيرتك الذاتية (PDF)</h1>
      <p className="mt-2 text-sm text-muted">
        هنستخرج مهاراتك تلقائيًا، ونحدد اللي ناقصك، ونديك مؤشر جاهزية مهنية ومقترحات تعلم.
      </p>

      <Card className="mt-8">
        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="cv-file">ملف الـ CV</label>
          <input
            id="cv-file"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="input"
          />
          <Button type="submit" loading={analyzing} variant="accent" fullWidth className="mt-5">
            حلّل الملف
          </Button>
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </form>
      </Card>

      {result && (
        <div className="mt-8 space-y-6">
          <Card title="مؤشر الجاهزية المهنية" eyebrow="Career Readiness Score">
            <p className="font-display text-3xl font-semibold text-ink">
              {result.careerReadinessScore}%
            </p>
          </Card>

          <Card title="المهارات المستخرجة" eyebrow="Extracted Skills">
            <div className="flex flex-wrap gap-2">
              {result.extractedSkills.length === 0 && (
                <p className="text-muted">مفيش مهارات معروفة اتلاقت في الملف.</p>
              )}
              {result.extractedSkills.map((skill) => (
                <span key={skill} className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <Card title="مهارات ناقصة" eyebrow="Missing Skills">
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.length === 0 && <p className="text-muted">ملياك، مفيش مهارات ناقصة!</p>}
              {result.missingSkills.map((skill) => (
                <span key={skill} className="rounded-full bg-danger/10 px-3 py-1 text-xs font-medium text-danger">
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <Card title="مسار تعلم مقترح" eyebrow="Personalized Learning Path">
            <ul className="space-y-2">
              {result.suggestedLearningPath.map((item) => (
                <li key={item.skill} className="flex justify-between border-b border-line pb-2 text-sm">
                  <span className="font-medium">{item.skill}</span>
                  <span className="text-muted">{item.resourceSuggestion}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CVAnalysis;
