import { SectionHeader } from '../components/section-header';
import { CASE, CASE_POINTS } from '../content';

export function CaseSection() {
  return (
    <section
      id="case"
      aria-labelledby="case-heading"
      className="section-pad border-t border-[var(--color-border-subtle)]"
    >
      <div className="section-max">
        <SectionHeader
          id="case-heading"
          index={CASE.index}
          title={
            <>
              {CASE.lead}
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                {CASE.trail}
              </span>
            </>
          }
          description={CASE.description}
        />

        <dl className="m-0">
          {CASE_POINTS.map((point) => (
            <div
              key={point.term}
              className="grid gap-2 border-t border-[var(--color-border-subtle)] py-5 md:grid-cols-12 md:gap-6"
            >
              <dt className="text-base font-medium text-[var(--color-text-primary)] md:col-span-3">
                {point.term}
              </dt>
              <dd className="m-0 text-[15px] text-[var(--color-text-secondary)] md:col-span-5">
                {point.detail}
              </dd>
              <dd className="m-0 font-mono text-[12px] text-[var(--color-fn)] md:col-span-4 md:text-[13px]">
                {point.evidence}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
