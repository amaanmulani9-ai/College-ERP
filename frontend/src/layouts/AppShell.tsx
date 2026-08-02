import type { AppRoute } from "../app/routes";

type AppShellProps = {
  routes: AppRoute[];
};

export function AppShell({ routes }: AppShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-sm font-medium text-cyan-300">Architecture scaffold</p>
            <h1 className="mt-2 text-3xl font-semibold">College ERP</h1>
          </div>
          <span className="rounded-sm border border-emerald-400/40 px-3 py-1 text-sm text-emerald-200">
            Ready
          </span>
        </header>

        <section className="grid flex-1 content-center gap-10 py-12 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
              Multi-tenant ERP foundation prepared for module development.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              The frontend shell, API boundary, environment handling, and route reservations are in place.
              Business modules are intentionally not implemented yet.
            </p>
          </div>

          <nav className="self-center border-l border-white/10 pl-6">
            <p className="text-sm uppercase text-slate-400">Reserved portals</p>
            <ul className="mt-4 space-y-3">
              {routes.map((route) => (
                <li key={route.path} className="flex items-center justify-between gap-4 border-b border-white/10 py-3">
                  <span className="font-medium">{route.label}</span>
                  <code className="text-sm text-slate-400">{route.path}</code>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </section>
    </main>
  );
}
