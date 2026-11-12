import Link from "next/link";

export function AppShell({
  children,
  right,
  variant = "page",
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
  variant?: "page" | "chat";
}) {
  return (
    <div className={variant === "chat" ? "min-h-screen flex flex-col" : "min-h-screen"}>
      <a className="skip-link" href={variant === "chat" ? "#ask" : "#main"}>
        Skip to {variant === "chat" ? "the question box" : "main content"}
      </a>
      <header className="no-print app-header">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            R
          </span>
          <span>
            <span className="brand-word">ROKU</span>
            <span className="brand-sub">Talent Intelligence</span>
          </span>
        </Link>
        <nav className="app-nav" aria-label="Primary">
          <Link href="/">Ask</Link>
          <Link href="/reports/weekly">Weekly pulse</Link>
        </nav>
        {right}
      </header>
      <main
        id="main"
        className={variant === "chat" ? "chat-main" : "page-main"}
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
}
