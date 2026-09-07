import { InstallCommand } from '../components/install-command';
import { SectionHeader } from '../components/section-header';
import { STACK, STACK_COMMANDS } from '../content';

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
          index={STACK.index}
          title={
            <>
              {STACK.lead}
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                {STACK.trail}
              </span>
            </>
          }
          description={STACK.description}
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
