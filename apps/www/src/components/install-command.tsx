import { useCopyFeedback } from './code-block';

type InstallCommandProps = {
  command: string;
  label?: string;
};

export function InstallCommand({
  command,
  label = 'Copy install command',
}: InstallCommandProps) {
  const { copied, copy } = useCopyFeedback();

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-3 font-mono text-[12px] leading-[1.5] md:text-[13px]">
      <span className="select-none text-[var(--color-text-tertiary)]" aria-hidden="true">
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-[var(--color-text-primary)]">
        {command}
      </code>
      <button
        type="button"
        aria-label={copied ? 'Command copied' : label}
        className="ml-auto inline-flex size-11 shrink-0 items-center justify-center text-[var(--color-text-tertiary)] transition-colors duration-150 hover:text-[var(--color-text-secondary)]"
        onClick={() => copy(command)}
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3.5 8.5 6.5 11.5 12.5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <rect
              x="5.5"
              y="5.5"
              width="7"
              height="7"
              rx="1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M3.5 10.5V3.5h7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
      <p className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </p>
    </div>
  );
}
