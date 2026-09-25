import type { KvkkData } from '@/lib/kvkkData';

export default function Kvkk({ data }: { data: KvkkData }) {
  return (
    <main className="flex flex-col gap-16 py-8">
      <section className="container">
        <article className="mx-auto max-w-3xl">
          <header className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">{data.title}</h2>
            <p className="text-sm text-muted-foreground">Son güncelleme: {data.lastUpdated}</p>
          </header>

          <div className="space-y-4 text-muted-foreground">
            {data.intro.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>

          {data.sections.map((section) => (
            <section key={section.title} className="mt-10">
              <h3 className="mb-3 text-xl font-semibold">{section.title}</h3>
              <div className="space-y-3 text-muted-foreground">
                {section.paragraphs?.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
                {section.items && (
                  <ul className="list-disc space-y-2 pl-6">
                    {section.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.after?.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}
