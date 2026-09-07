import { NAV_LINKS, REPO_URL } from '../content';

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-[var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--color-bg-elevated)_92%,transparent)] backdrop-blur-md md:h-16">
      <div className="section-max flex h-full items-center justify-between gap-4 px-[clamp(1rem,4vw,2.5rem)]">
        <a
          href="#top"
          className="shrink-0 text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-text-primary)] no-underline"
        >
          Polyfed
        </a>
        <nav aria-label="Page sections" className="min-w-0 flex-1">
          <ul className="m-0 flex list-none items-center justify-end gap-4 overflow-x-auto p-0 md:gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="shrink-0">
                <a
                  href={link.href}
                  className="text-sm font-medium text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="shrink-0">
              <a
                className="btn-primary px-3 py-1.5 text-sm"
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
