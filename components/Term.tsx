import { define } from "@/lib/domain/glossary";

export function Term({ abbr }: { abbr: string }) {
  const t = define(abbr);
  if (!t) return <span>{abbr}</span>;
  return (
    <abbr
      title={`${t.expand}: ${t.meaning}`}
      className="cursor-help decoration-dotted underline underline-offset-4"
    >
      {t.abbr}
    </abbr>
  );
}

export function TermLine({ abbr }: { abbr: string }) {
  const t = define(abbr);
  if (!t) return null;
  return (
    <p className="text-xs text-[#cbbbe3] leading-snug">
      <strong className="text-white">{t.abbr}</strong> — {t.expand}. {t.meaning}
    </p>
  );
}
