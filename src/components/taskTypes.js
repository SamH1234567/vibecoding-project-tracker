import { Bug, Sparkles } from 'lucide-react';

// Single source of truth for how each task type looks (DESIGN §2, M6).
// Every component styles types through this map so they stay consistent.
// Class names are written out in full so Tailwind can find them.
export const TASK_TYPES = {
  feature: {
    label: 'Feature',
    Icon: Sparkles,
    stripe: 'bg-type-feature',
    text: 'text-type-feature',
    selected: 'border-type-feature bg-type-feature/10 text-type-feature',
  },
  bug: {
    label: 'Bug',
    Icon: Bug,
    stripe: 'bg-type-bug',
    text: 'text-type-bug',
    selected: 'border-type-bug bg-type-bug/10 text-type-bug',
  },
};
