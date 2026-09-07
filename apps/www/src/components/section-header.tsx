import type { ReactNode } from 'react';

type SectionHeaderProps = {
  id: string;
  index: string;
  title: ReactNode;
  description: string;
};

export function SectionHeader({
  id,
  index,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-10 grid gap-4 md:grid-cols-12 md:gap-8">
      <h2
        id={id}
        className="md:col-span-6 text-[clamp(24px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--color-text-primary)]"
      >
        {title}
      </h2>
      <div className="md:col-span-5 md:col-start-8">
        <p className="m-0 max-w-[70ch] text-[15px] leading-[1.6] text-[var(--color-text-secondary)] md:text-base">
          {description}
        </p>
        <p className="mt-3 font-mono text-[12px] text-[var(--color-text-tertiary)] md:text-[13px]">
          {index}
        </p>
      </div>
    </div>
  );
}
