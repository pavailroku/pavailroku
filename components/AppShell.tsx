import Link from "next/link";

export function AppShell({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="no-print flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 text-white no-underline">
          <span className="h-9 w-9 rounded-md bg-[var(--roku-purple)] grid place-items-center font-black">
            R
          </span>
          <span>
            <span className="block text-sm font-bold tracking-wide">ROKU</span>
            <span className="block text-xs text-[#cbbbe3]">Talent Intelligence</span>
          </span>
        </Link>
        <nav className="no-print flex flex-wrap items-center gap-3 text-sm">
          <Link href="/briefings/new" className="text-white no-underline">
            New briefing
          </Link>
          <Link href="/reports/weekly" className="text-white no-underline">
            Weekly digest
          </Link>
          <Link href="/reports/monthly" className="text-white no-underline">
            Monthly digest
          </Link>
        </nav>
        {right}
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
