import { SectionHeader } from '../components/section-header';
import { PROBLEM_ROWS } from '../content';

export function ProblemSection() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="section-pad border-t border-[var(--color-border-subtle)]"
    >
      <div className="section-max">
        <SectionHeader
          id="problem-heading"
          index="2.0 Diff →"
          title={
            <>
              Fat monorepo vs Polyfed.
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                Same federation, different checkout contract.
              </span>
            </>
          }
          description="Cargo you did not order leaves the clone. Missing remotes become offline UI or prod entries — not broken builds."
        />

        <div className="frame-outer">
          <div className="frame-inner overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <caption className="sr-only">
                Comparison of monorepo Module Federation pain versus Polyfed
              </caption>
              <thead>
                <tr className="bg-[var(--color-bg-elevated)]">
                  <th
                    scope="col"
                    className="border-b border-[var(--color-border-subtle)] px-4 py-3 font-mono text-[12px] font-medium text-[var(--color-err)]"
                  >
                    − monorepo
                  </th>
                  <th
                    scope="col"
                    className="border-b border-[var(--color-border-subtle)] px-4 py-3 font-mono text-[12px] font-medium text-[var(--color-str)]"
                  >
                    + polyfed
                  </th>
                </tr>
              </thead>
              <tbody>
                {PROBLEM_ROWS.map((row) => (
                  <tr key={row.monorepo} className="align-top">
                    <td className="border-b border-[var(--color-border-subtle)] px-4 py-3.5 text-[var(--color-text-tertiary)]">
                      <span className="mr-2 select-none font-mono text-[var(--color-err)]">
                        −
                      </span>
                      {row.monorepo}
                    </td>
                    <td className="border-b border-[var(--color-border-subtle)] px-4 py-3.5 text-[var(--color-text-primary)]">
                      <span className="mr-2 select-none font-mono text-[var(--color-str)]">
                        +
                      </span>
                      {row.polyfed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
