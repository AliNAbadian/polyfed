import { CodeBlock } from '../components/code-block';
import { InstallCommand } from '../components/install-command';
import {
  HERO_COPY,
  HERO_FILENAME,
  HERO_LANG,
  INSTALL_COMMAND,
  REPO_URL,
} from '../content';

const heroLines = [
  {
    n: 1,
    nodes: (
      <>
        <span className="tok-kw">export</span>{' '}
        <span className="tok-kw">function</span>{' '}
        <span className="tok-fn">resolveRemoteEntry</span>
        <span className="tok-punct">(</span>
        <span className="tok-plain">remote</span>
        <span className="tok-punct">,</span> <span className="tok-plain">workspaceRoot</span>
        <span className="tok-punct">)</span> <span className="tok-punct">{'{'}</span>
      </>
    ),
  },
  {
    n: 2,
    nodes: (
      <>
        {'  '}
        <span className="tok-kw">const</span> <span className="tok-plain">checkedOut</span>{' '}
        <span className="tok-punct">=</span>{' '}
        <span className="tok-fn">isRemoteCheckedOut</span>
        <span className="tok-punct">(</span>
        <span className="tok-plain">remote.name</span>
        <span className="tok-punct">,</span> <span className="tok-plain">workspaceRoot</span>
        <span className="tok-punct">);</span>
      </>
    ),
  },
  {
    n: 3,
    highlight: true,
    nodes: (
      <>
        {'  '}
        <span className="tok-kw">if</span> <span className="tok-punct">(</span>
        <span className="tok-plain">checkedOut</span>
        <span className="tok-punct">)</span> <span className="tok-punct">{'{'}</span>
      </>
    ),
  },
  {
    n: 4,
    highlight: true,
    nodes: (
      <>
        {'    '}
        <span className="tok-kw">return</span> <span className="tok-plain">remote.entry</span>
        <span className="tok-punct">?.</span>
        <span className="tok-plain">dev</span> <span className="tok-punct">||</span>{' '}
        <span className="tok-fn">remoteEntryUrl</span>
        <span className="tok-punct">(</span>
        <span className="tok-plain">remote.port</span>
        <span className="tok-punct">);</span>
      </>
    ),
  },
  {
    n: 5,
    nodes: (
      <>
        {'  '}
        <span className="tok-punct">{'}'}</span>
      </>
    ),
  },
  {
    n: 6,
    nodes: (
      <>
        {'  '}
        <span className="tok-kw">const</span> <span className="tok-plain">prod</span>{' '}
        <span className="tok-punct">=</span>
      </>
    ),
  },
  {
    n: 7,
    nodes: (
      <>
        {'    '}
        <span className="tok-kw">typeof</span> <span className="tok-plain">remote.entry</span>
        <span className="tok-punct">?.</span>
        <span className="tok-plain">prod</span> <span className="tok-punct">===</span>{' '}
        <span className="tok-str">'string'</span> <span className="tok-punct">?</span>{' '}
        <span className="tok-plain">remote.entry.prod.trim</span>
        <span className="tok-punct">()</span> <span className="tok-punct">:</span>{' '}
        <span className="tok-str">''</span>
        <span className="tok-punct">;</span>
      </>
    ),
  },
  {
    n: 8,
    nodes: (
      <>
        {'  '}
        <span className="tok-kw">if</span> <span className="tok-punct">(</span>
        <span className="tok-plain">prod</span>
        <span className="tok-punct">)</span> <span className="tok-kw">return</span>{' '}
        <span className="tok-plain">prod</span>
        <span className="tok-punct">;</span>
      </>
    ),
  },
  {
    n: 9,
    highlight: true,
    nodes: (
      <>
        {'  '}
        <span className="tok-kw">return</span> <span className="tok-const">null</span>
        <span className="tok-punct">;</span>{' '}
        <span className="tok-comment">// shell shows offline UI</span>
      </>
    ),
  },
  {
    n: 10,
    nodes: <span className="tok-punct">{'}'}</span>,
  },
];

export function HeroSection() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="section-pad motion-rise"
    >
      <div className="section-max grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <p className="mb-4 font-mono text-[13px] text-[var(--color-text-tertiary)]">
            polyfed · MIT · Nx + Vite MF
          </p>
          <h1
            id="hero-heading"
            className="mb-6 text-[clamp(32px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.03em]"
          >
            Pull the remotes you own.
            <span className="text-[var(--color-text-secondary)]">
              {' '}
              Federate the rest — without cloning the whole monorepo.
            </span>
          </h1>
          <p className="mb-8 max-w-[70ch] text-[15px] text-[var(--color-text-secondary)] md:text-base">
            Polyrepo Module Federation for React. Platform git holds the shell and
            packages; remotes stay separate repos with honest{' '}
            <code className="font-mono text-[13px] text-[var(--color-fn)]">
              entry.dev
            </code>{' '}
            /{' '}
            <code className="font-mono text-[13px] text-[var(--color-fn)]">
              entry.prod
            </code>{' '}
            /{' '}
            <code className="font-mono text-[13px] text-[var(--color-const)]">
              null
            </code>
            .
          </p>
          <div className="mb-6 flex flex-wrap gap-3">
            <a
              className="btn-primary"
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Clone repository
            </a>
            <a className="btn-ghost" href="#walkthrough">
              Watch session
            </a>
          </div>
          <InstallCommand command={INSTALL_COMMAND} />
        </div>

        <div className="hero-lift">
          <CodeBlock
            filename={HERO_FILENAME}
            language={HERO_LANG}
            copyText={HERO_COPY}
            lines={heroLines}
          />
        </div>
      </div>
    </section>
  );
}
