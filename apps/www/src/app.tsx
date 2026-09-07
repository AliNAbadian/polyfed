import { SiteNav } from './components/site-nav';
import { HeroSection } from './sections/hero-section';
import { InstallSection } from './sections/install-section';
import { ProblemSection } from './sections/problem-section';
import { ModelSection } from './sections/model-section';
import { WalkthroughSection } from './sections/walkthrough-section';
import { RegistrySection } from './sections/registry-section';
import { StackSection } from './sections/stack-section';
import { CaseSection } from './sections/case-section';
import { CtaSection } from './sections/cta-section';

export function App() {
  return (
    <div className="min-h-dvh bg-[var(--color-bg-base)]">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main">
        <HeroSection />
        <InstallSection />
        <ProblemSection />
        <ModelSection />
        <WalkthroughSection />
        <RegistrySection />
        <StackSection />
        <CaseSection />
        <CtaSection />
      </main>
      <footer className="section-pad border-t border-[var(--color-border-subtle)]">
        <div className="section-max flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--color-text-tertiary)]">
          <p className="m-0">
            <span className="font-semibold text-[var(--color-text-primary)]">
              Polyfed
            </span>{' '}
            — polyrepo Module Federation for React.
          </p>
          <p className="m-0 font-mono text-[12px]">
            v0.1.0 · MIT · not an MF remote
          </p>
        </div>
      </footer>
    </div>
  );
}
