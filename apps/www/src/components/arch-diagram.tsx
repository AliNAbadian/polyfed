export type ArchMode = 'local' | 'prod' | 'offline';

type ArchDiagramProps = {
  mode: ArchMode;
  onModeChange: (mode: ArchMode) => void;
};

const MODES: { id: ArchMode; label: string }[] = [
  { id: 'local', label: 'Local' },
  { id: 'prod', label: 'Prod' },
  { id: 'offline', label: 'Offline' },
];

export function ArchDiagram({ mode, onModeChange }: ArchDiagramProps) {
  const stroke =
    mode === 'offline' ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)';
  const accent = mode === 'offline' ? 'var(--color-err)' : 'var(--color-fn)';
  const arrowLabel =
    mode === 'local'
      ? 'entry.dev'
      : mode === 'prod'
        ? 'entry.prod'
        : 'null';

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Architecture view" className="flex flex-wrap gap-2">
        {MODES.map((item) => {
          const selected = item.id === mode;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              className={
                selected
                  ? 'rounded-md border border-[color-mix(in_srgb,var(--color-fn)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-fn)_8%,transparent)] px-3 py-1.5 text-sm font-medium text-[var(--color-fn)] ring-1 ring-[color-mix(in_srgb,var(--color-fn)_40%,transparent)]'
                  : 'rounded-md border border-[var(--color-border-subtle)] bg-transparent px-3 py-1.5 text-sm font-medium text-[var(--color-text-tertiary)]'
              }
              onClick={() => onModeChange(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="frame-outer">
        <div className="frame-inner p-4">
          <svg
            viewBox="0 0 640 240"
            width="100%"
            height="auto"
            role="img"
            aria-label={`Platform to remotes in ${mode} mode via ${arrowLabel}`}
          >
            <rect
              x="32"
              y="70"
              width="168"
              height="100"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-strong)"
              strokeWidth="1"
              rx="4"
            />
            <text
              x="116"
              y="118"
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontFamily="IBM Plex Sans, sans-serif"
              fontSize="15"
              fontWeight="600"
            >
              platform
            </text>
            <text
              x="116"
              y="140"
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
            >
              shell · packages
            </text>

            <line
              x1="200"
              y1="120"
              x2="340"
              y2="120"
              stroke={accent}
              strokeWidth="1"
            />
            <polygon
              points="340,115 352,120 340,125"
              fill={accent}
            />
            <text
              x="270"
              y="108"
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
            >
              {arrowLabel}
            </text>

            {[
              { y: 28, label: 'promotions' },
              { y: 98, label: 'targeting' },
              { y: 168, label: 'orders' },
            ].map((remote) => (
              <g key={remote.label}>
                <rect
                  x="380"
                  y={remote.y}
                  width="220"
                  height="52"
                  fill="var(--color-bg-base)"
                  stroke={stroke}
                  strokeWidth="1"
                  strokeDasharray={mode === 'offline' ? '4 3' : undefined}
                  rx="4"
                />
                <text
                  x="490"
                  y={remote.y + 32}
                  textAnchor="middle"
                  fill="var(--color-text-secondary)"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="13"
                >
                  apps/{remote.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
