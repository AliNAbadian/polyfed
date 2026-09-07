import { SectionHeader } from '../components/section-header';
import { REGISTRY_ROWS } from '../content';

export function RegistrySection() {
  return (
    <section
      id="registry"
      aria-labelledby="registry-heading"
      className="section-pad border-t border-[var(--color-border-subtle)]"
    >
      <div className="section-max">
        <SectionHeader
          id="registry-heading"
          index="5.0 Registry →"
          title={
            <>
              Browser never ships git URLs.
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                Vite reads remotes.json; React reads nav.json.
              </span>
            </>
          }
          description="Split the registry so the client bundle stays clean and scripts keep full checkout metadata."
        />

        <dl className="m-0 border-t border-[var(--color-border-subtle)]">
          {REGISTRY_ROWS.map((row) => (
            <div
              key={row.piece}
              className="grid gap-2 border-b border-[var(--color-border-subtle)] py-5 md:grid-cols-12 md:gap-6"
            >
              <dt className="font-mono text-[13px] text-[var(--color-fn)] md:col-span-3">
                {row.piece}
              </dt>
              <dd className="m-0 md:col-span-3">
                <span className="text-sm text-[var(--color-text-primary)]">
                  {row.who}
                </span>
              </dd>
              <dd className="m-0 text-[15px] text-[var(--color-text-secondary)] md:col-span-6">
                {row.what}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
