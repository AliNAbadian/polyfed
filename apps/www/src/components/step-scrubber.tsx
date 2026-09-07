import { WALKTHROUGH_STEPS } from '../content';

type StepScrubberProps = {
  stepIndex: number;
  onStepChange: (index: number) => void;
};

export function StepScrubber({ stepIndex, onStepChange }: StepScrubberProps) {
  return (
    <div role="group" aria-label="Walkthrough steps" className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {WALKTHROUGH_STEPS.map((step, index) => {
          const selected = index === stepIndex;
          return (
            <button
              key={step.id}
              type="button"
              aria-pressed={selected}
              aria-label={`Step ${index + 1}: ${step.title}`}
              className={
                selected
                  ? 'rounded-md border border-[color-mix(in_srgb,var(--color-fn)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-fn)_8%,transparent)] px-3 py-2 text-sm font-medium text-[var(--color-fn)] ring-1 ring-[color-mix(in_srgb,var(--color-fn)_40%,transparent)]'
                  : 'rounded-md border border-[var(--color-border-subtle)] bg-transparent px-3 py-2 text-sm font-medium text-[var(--color-text-tertiary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-secondary)]'
              }
              onClick={() => onStepChange(index)}
            >
              <span className="font-mono text-[12px]">{index + 1}</span>
              <span className="ml-2 hidden sm:inline">{step.title}</span>
            </button>
          );
        })}
      </div>
      <label className="flex items-center gap-3 text-sm text-[var(--color-text-tertiary)]">
        <span className="shrink-0 font-mono text-[12px]">step</span>
        <input
          type="range"
          min={0}
          max={WALKTHROUGH_STEPS.length - 1}
          step={1}
          value={stepIndex}
          aria-valuetext={WALKTHROUGH_STEPS[stepIndex]?.title}
          onChange={(event) => onStepChange(Number(event.target.value))}
          className="w-full accent-[var(--color-fn)]"
        />
        <span className="shrink-0 font-mono text-[12px] text-[var(--color-text-secondary)]">
          ?step={stepIndex + 1}
        </span>
      </label>
    </div>
  );
}
