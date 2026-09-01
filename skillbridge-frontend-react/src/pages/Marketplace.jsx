import { useState } from 'react';
import useProjects from '../hooks/useProjects';
import Card from '../components/common/Card';
import { formatCurrency, statusLabel } from '../utils/helpers';

const Marketplace = () => {
  const [status, setStatus] = useState('open');
  const { projects, loading, error } = useProjects({ status });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <span className="eyebrow">سوق المشاريع الحر</span>
      <h1 className="mt-2 text-2xl font-semibold">المشاريع المتاحة</h1>

      <div className="mt-6 flex gap-2">
        {['open', 'in_progress', 'completed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              status === s ? 'bg-ink text-white' : 'bg-white text-muted border border-line'
            }`}
          >
            {statusLabel(s)}
          </button>
        ))}
      </div>

      {loading && <p className="mt-8 text-sm text-muted">جاري تحميل المشاريع...</p>}
      {error && <p className="mt-8 text-sm text-danger">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 && (
            <p className="text-muted col-span-full">مفيش مشاريع بالحالة دي دلوقتي.</p>
          )}
          {projects.map((project) => (
            <Card
              key={project._id}
              eyebrow={statusLabel(project.status)}
              title={project.title}
              footer={<span className="font-semibold text-ink">{formatCurrency(project.budget)}</span>}
            >
              <p className="line-clamp-3">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(project.skillsRequired || []).map((skill) => (
                  <span key={skill} className="rounded-full bg-ink/5 px-2.5 py-1 text-xs text-ink">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
