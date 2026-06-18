import type { LanguageStat } from '@/types/github';

type LanguageBreakdownProps = {
  languages: LanguageStat[];
};

export function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
  if (languages.length === 0) {
    return (
      <section className="panel">
        <h3>Languages</h3>
        <p className="panel__empty">No language data available for public repos.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h3>Languages</h3>
      <ul className="language-list">
        {languages.map((item) => (
          <li key={item.language} className="language-list__item">
            <div className="language-list__row">
              <span>{item.language}</span>
              <span>{item.percentage}%</span>
            </div>
            <div className="language-list__bar" aria-hidden="true">
              <span style={{ width: `${item.percentage}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
