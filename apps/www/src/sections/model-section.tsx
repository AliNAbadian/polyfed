import { SectionHeader } from '../components/section-header';
import { MODEL_SNIPPETS } from '../content';

export function ModelSection() {
  return (
    <section
      id="model"
      aria-labelledby="model-heading"
      className="section-pad border-t border-[var(--color-border-subtle)]"
    >
      <div className="section-max">
        <SectionHeader
          id="model-heading"
          index="3.0 Model →"
          title={
            <>
              Platform owns the dock.
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                Remotes are stamped crates you pull on demand.
              </span>
            </>
          }
          description="Three contracts: platform git, remote repos, and resolveRemoteEntry honesty. Evidence sits under each claim."
        />

        <ul className="m-0 grid list-none gap-0 p-0 md:grid-cols-3">
          {MODEL_SNIPPETS.map((point, index) => (
            <li
              key={point.title}
              className={
                index === 0
                  ? 'py-2 md:pr-10'
                  : 'border-t border-[var(--color-border-subtle)] py-6 md:border-t-0 md:border-l md:py-2 md:pl-10'
              }
            >
              <h3 className="mb-2 text-xl font-medium tracking-[-0.02em] text-[var(--color-text-primary)]">
                {point.title}
              </h3>
              <p className="mb-4 text-[15px] text-[var(--color-text-secondary)]">
                {point.body}
              </p>
              <pre className="m-0 overflow-x-auto rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-3 py-2 font-mono text-[12px] leading-[1.6] text-[var(--color-fn)] md:text-[13px]">
                <code>{point.sample}</code>
              </pre>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
