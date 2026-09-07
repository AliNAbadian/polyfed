import type { TerminalLine } from '../content';

type TerminalPanelProps = {
  title?: string;
  lines: readonly TerminalLine[];
};

export function TerminalPanel({
  title = 'session',
  lines,
}: TerminalPanelProps) {
  return (
    <div className="frame-outer">
      <div className="frame-inner">
        <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[var(--color-border-strong)]" />
            <span className="size-2.5 rounded-full bg-[var(--color-border-strong)]" />
            <span className="size-2.5 rounded-full bg-[var(--color-border-strong)]" />
          </span>
          <span className="ml-2 font-mono text-[12px] text-[var(--color-text-tertiary)]">
            {title}
          </span>
        </div>
        <div className="scroll-fade-x">
          <pre className="m-0 min-h-[11.5rem] overflow-x-auto p-4 font-mono text-[12px] leading-[1.6] md:text-[13px]">
            {lines.map((line, i) => {
              if (line.kind === 'in') {
                return (
                  <div key={i} className="whitespace-pre">
                    <span className="select-none text-[var(--color-text-tertiary)]">
                      ${' '}
                    </span>
                    <span className="text-[var(--color-text-primary)]">
                      {line.text}
                    </span>
                  </div>
                );
              }
              const color =
                line.kind === 'ok'
                  ? 'tok-str'
                  : line.kind === 'err'
                    ? 'tok-err'
                    : line.kind === 'dim'
                      ? 'tok-comment'
                      : 'text-[var(--color-text-secondary)]';
              return (
                <div key={i} className={`whitespace-pre ${color}`}>
                  {line.text}
                </div>
              );
            })}
          </pre>
          <div className="scroll-fade-x__edge" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
