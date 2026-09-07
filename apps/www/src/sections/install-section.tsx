import { InstallCommand } from '../components/install-command';
import { SectionHeader } from '../components/section-header';
import { INSTALL_COMMAND } from '../content';

export function InstallSection() {
  return (
    <section
      id="install"
      aria-labelledby="install-heading"
      className="section-pad border-t border-[var(--color-border-subtle)]"
    >
      <div className="section-max">
        <SectionHeader
          id="install-heading"
          index="1.0 Install →"
          title={
            <>
              One clone. One install.
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                Remotes arrive later with pull-remote.
              </span>
            </>
          }
          description="Copy the line. Shell lands on 4200. Checked-out remotes join the same continuous Vite graph."
        />
        <div className="max-w-3xl">
          <InstallCommand command={INSTALL_COMMAND} />
          <p className="mt-4 font-mono text-[12px] text-[var(--color-text-tertiary)] md:text-[13px]">
            optional story surface:{' '}
            <span className="text-[var(--color-text-secondary)]">bun run www</span>{' '}
            → 127.0.0.1:4300
          </p>
        </div>
      </div>
    </section>
  );
}
