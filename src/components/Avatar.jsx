export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

// Initials in a circle. Neutral indigo for everyone: on this board colour is
// reserved for task type and due state (DESIGN §2).
export default function Avatar({ name, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs';
  return (
    <span
      title={name}
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand-primary/10 font-semibold text-brand-primary ${sizeClass}`}
    >
      {initials(name)}
    </span>
  );
}
