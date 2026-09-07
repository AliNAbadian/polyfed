import { useState } from 'react';
import { ArchDiagram, type ArchMode } from '../components/arch-diagram';
import { InstallCommand } from '../components/install-command';
import { SectionHeader } from '../components/section-header';
import { StepScrubber } from '../components/step-scrubber';
import { TerminalPanel } from '../components/terminal-panel';
import { useWalkthroughSteps } from '../hooks/use-walkthrough-steps';

export function WalkthroughSection() {
  const { stepIndex, step, setStep } = useWalkthroughSteps();
  const [mode, setMode] = useState<ArchMode>('local');

  return (
    <section
      id="walkthrough"
      aria-labelledby="walkthrough-heading"
      className="section-pad border-t border-[var(--color-border-subtle)]"
    >
      <div className="section-max">
        <SectionHeader
          id="walkthrough-heading"
          index="4.0 Session →"
          title={
            <>
              Pull → federate.
              <span className="text-[var(--color-text-secondary)]">
                {' '}
                A terminal session, not a marketing carousel.
              </span>
            </>
          }
          description="Scrub the real CLI path. URL keeps ?step= in sync. Toggle Local / Prod / Offline to see how entries resolve."
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <StepScrubber stepIndex={stepIndex} onStepChange={setStep} />
            <div key={step.id} className="motion-cross">
              <h3 className="mb-2 text-xl font-medium text-[var(--color-text-primary)]">
                {step.title}
              </h3>
              <p className="mb-4 text-[15px] text-[var(--color-text-secondary)]">
                {step.body}
              </p>
              <TerminalPanel title={`polyfed · ${step.id}`} lines={step.lines} />
              <div className="mt-3">
                <InstallCommand command={step.command} label="Copy step command" />
              </div>
            </div>
          </div>
          <ArchDiagram mode={mode} onModeChange={setMode} />
        </div>
      </div>
    </section>
  );
}
