import { InstallCommand } from '../components/install-command';
import { INSTALL_COMMAND, REPO_URL } from '../content';

export function CtaSection() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="section-pad border-t border-[var(--color-border-subtle)]"
    >
      <div className="section-max">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2
              id="cta-heading"
              className="mb-4 text-[clamp(24px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.03em]"
            >
              Clone the platform.
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                Run the dock.
              </span>
            </h2>
            <p className="mb-6 max-w-[70ch] text-[15px] text-[var(--color-text-secondary)]">
              Live federation stays in the shell on 4200. This site is the story —
              second terminal for{' '}
              <code className="font-mono text-[13px] text-[var(--color-fn)]">
                bun run www
              </code>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="btn-primary"
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open repository
              </a>
              <a className="btn-ghost" href="#walkthrough">
                Replay session
              </a>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="mb-3 font-mono text-[12px] text-[var(--color-text-tertiary)]">
              8.0 CTA →
            </p>
            <InstallCommand command={INSTALL_COMMAND} />
          </div>
        </div>
      </div>
    </section>
  );
}
