import { useEffect, useState, type ReactNode } from 'react';

type CodeBlockProps = {
  filename: string;
  language?: string;
  copyText: string;
  lines: { n: number; highlight?: boolean; nodes: ReactNode }[];
  className?: string;
  fadeBottom?: boolean;
};

function CopyGlyph({ copied }: { copied: boolean }) {
  if (copied) {
    return (
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
    );
  }
  return (
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
  );
}

export function useCopyFeedback() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return { copied, copy };
}

export function CodeBlock({
  filename,
  language = 'TypeScript',
  copyText,
  lines,
  className = '',
  fadeBottom = false,
}: CodeBlockProps) {
  const { copied, copy } = useCopyFeedback();

  return (
    <figure className={`frame-outer ${className}`.trim()}>
      <div className={`frame-inner ${fadeBottom ? 'mask-fade-bottom' : ''}`.trim()}>
        <figcaption className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <span className="font-mono text-[13px] text-[var(--color-text-secondary)]">
            {filename}
          </span>
          <span className="ml-auto font-mono text-[12px] text-[var(--color-text-tertiary)]">
            {language}
          </span>
          <button
            type="button"
            aria-label={copied ? 'Code copied' : 'Copy code'}
            className="inline-flex size-11 items-center justify-center text-[var(--color-text-tertiary)] transition-colors duration-150 hover:text-[var(--color-text-secondary)]"
            onClick={() => copy(copyText)}
          >
            <CopyGlyph copied={copied} />
          </button>
        </figcaption>
        <div className="scroll-fade-x">
          <pre
            className="m-0 overflow-x-auto p-4 font-mono text-[13px] leading-[1.6] md:text-[14px]"
            lang="js"
          >
            <code>
              {lines.map((line) => (
                <span
                  key={line.n}
                  className={
                    line.highlight
                      ? 'flex border-l-2 border-[var(--color-fn)] bg-[color-mix(in_srgb,var(--color-fn)_5%,transparent)]'
                      : 'flex'
                  }
                >
                  <span className="w-8 shrink-0 select-none pr-2 text-right text-[var(--color-text-disabled)] md:w-10 md:pr-4">
                    {line.n}
                  </span>
                  <span className="min-w-0 whitespace-pre">{line.nodes}</span>
                </span>
              ))}
            </code>
          </pre>
          <div className="scroll-fade-x__edge" aria-hidden="true" />
        </div>
        <p className="sr-only" aria-live="polite">
          {copied ? 'Copied to clipboard' : ''}
        </p>
      </div>
    </figure>
  );
}
