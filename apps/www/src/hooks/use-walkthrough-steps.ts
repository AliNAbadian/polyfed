import { useCallback, useEffect, useState } from 'react';
import { WALKTHROUGH_STEPS } from '../content';

function readStepFromUrl(): number {
  if (typeof window === 'undefined') return 0;
  const raw = new URLSearchParams(window.location.search).get('step');
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 0;
  return Math.min(WALKTHROUGH_STEPS.length - 1, Math.floor(n) - 1);
}

export function useWalkthroughSteps() {
  const [stepIndex, setStepIndex] = useState(readStepFromUrl);

  const setStep = useCallback((index: number) => {
    const next = Math.max(0, Math.min(WALKTHROUGH_STEPS.length - 1, index));
    setStepIndex(next);
    const url = new URL(window.location.href);
    url.searchParams.set('step', String(next + 1));
    window.history.replaceState(null, '', url);
  }, []);

  useEffect(() => {
    function onPopState() {
      setStepIndex(readStepFromUrl());
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return {
    stepIndex,
    step: WALKTHROUGH_STEPS[stepIndex]!,
    setStep,
    steps: WALKTHROUGH_STEPS,
  };
}
