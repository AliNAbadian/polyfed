import { InstallCommand } from '../components/install-command';
import { SectionHeader } from '../components/section-header';
import { STACK_COMMANDS } from '../content';

export function StackSection() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      className="section-pad border-t border-[var(--color-border-subtle)]"
    >
      <div className="section-max">
        <SectionHeader
          id="stack-heading"
          index="6.0 CLI →"
          title={
            <>
              Commands that matter.
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                Nx + Bun + Vite Module Federation.
              </span>
            </>
          }
          description="Auth and axios stay platform singletons. Presentation site runs on 4300 — never mixed into bun run dev."
        />

        <ul className="m-0 grid list-none gap-px bg-[var(--color-border-subtle)] p-0 md:grid-cols-2">
          {STACK_COMMANDS.map((item) => (
            <li
              key={item.command}
              className="bg-[var(--color-bg-base)] p-4 md:p-5"
            >
              <p className="mb-3 font-mono text-[12px] text-[var(--color-text-tertiary)]">
                {item.label}
              </p>
              <InstallCommand command={item.command} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
