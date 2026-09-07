import { InstallCommand } from '../components/install-command';
import { SectionHeader } from '../components/section-header';
import { INSTALL, INSTALL_COMMAND } from '../content';

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
          index={INSTALL.index}
          title={
            <>
              {INSTALL.lead}
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                {INSTALL.trail}
              </span>
            </>
          }
          description={INSTALL.description}
        />
        <div className="max-w-3xl">
          <InstallCommand command={INSTALL_COMMAND} />
          <p className="mt-4 font-mono text-[12px] text-[var(--color-text-tertiary)] md:text-[13px]">
            {INSTALL.note}
          </p>
        </div>
      </div>
    </section>
  );
}
