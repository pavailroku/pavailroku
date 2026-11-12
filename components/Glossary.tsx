import { GLOSSARY } from "@/lib/domain/glossary";

export function Glossary() {
  return (
    <section className="card mt-8" aria-labelledby="glossary">
      <h2 id="glossary" className="display text-lg mb-2">
        Words this engine uses
      </h2>
      <p className="text-sm text-[#cbbbe3] mb-4">
        Hover any abbreviation in the product, or read the short list here.
      </p>
      <dl className="grid gap-3 md:grid-cols-2">
        {GLOSSARY.map((t) => (
          <div key={t.abbr}>
            <dt className="text-sm font-bold">
              {t.abbr} — {t.expand}
            </dt>
            <dd className="text-sm text-[#cbbbe3] m-0">{t.meaning}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
