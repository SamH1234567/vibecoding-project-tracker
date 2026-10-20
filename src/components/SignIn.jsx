import Avatar from './Avatar';

// "Who are you?" start screen (client's login requirement). A prototype: no
// passwords and nothing leaves the browser. Choosing a name sets "me" for
// "My tasks" and for who-did-what in the activity log.
export default function SignIn({ board, team, onSignIn }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page p-6 font-sans text-text-primary">
      <main className="w-full max-w-sm rounded-2xl bg-surface-card p-8 shadow-md">
        <h1 className="text-2xl font-semibold text-brand-primary">Sprint</h1>
        <p className="mt-1 text-sm text-text-muted">
          Who are you on <span className="font-medium text-text-primary">{board.name}</span>?
        </p>

        <ul className="mt-6 flex flex-col gap-2">
          {team.map((member) => (
            <li key={member.id}>
              <button
                type="button"
                onClick={() => onSignIn(member.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm hover:border-brand-primary/50 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <Avatar name={member.name} size="md" />
                <span className="font-medium">{member.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => onSignIn(team[0].id)}
          className="mt-4 w-full rounded-full bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          Continue as demo user
        </button>

        <p className="mt-6 text-xs text-text-muted">
          Prototype sign-in: no passwords, and nothing leaves this browser.
        </p>
      </main>
    </div>
  );
}
