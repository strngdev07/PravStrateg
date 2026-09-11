import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { JsonLd, breadcrumbSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { POLICY_TITLE, policyBlocks } from "@/content/legal/policy";

/**
 * Адрес страницы закреплён пунктом 12.4 самой политики:
 * «Актуальный текст Политики размещен по адресу: https://pravstrateg.ru/policy/».
 * Менять маршрут нельзя — документ ссылается на него.
 */
export const metadata: Metadata = pageMetadata({
  title: POLICY_TITLE,
  description:
    "Политика ИП Новикова И. В. в отношении обработки персональных данных: цели, правовые основания, сроки обработки, права субъектов, cookie и меры безопасности.",
  path: "/policy",
});

function PolicyTable({ rows }: { rows: string[][][] }) {
  const [header, ...body] = rows;

  return (
    <div className="my-7 overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
        {header ? (
          <thead>
            <tr>
              {header.map((cell, index) => (
                <th
                  key={index}
                  scope="col"
                  className="border border-line bg-bg-muted px-3 py-2.5 align-top font-medium text-ink"
                >
                  {cell.join(" ")}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-line px-3 py-2.5 align-top text-ink-soft"
                >
                  {cell.length > 1 ? (
                    <ul className="list-inside list-disc space-y-1">
                      {cell.map((line, lineIndex) => (
                        <li key={lineIndex}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    (cell[0] ?? "")
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PolicyPage() {
  return (
    <>
      <div className="bg-bg-soft py-12 md:py-16">
        <Container width="narrow">
          <p className="eyebrow mb-4">Правовые документы</p>
          <h1 className="text-[1.9rem] sm:text-[2.4rem]">{POLICY_TITLE}</h1>
        </Container>
      </div>

      <div className="py-12 md:py-16">
        <Container width="narrow">
          <article className="text-[0.98rem] leading-relaxed text-ink-soft">
            {policyBlocks.map((block, index) => {
              if (block.type === "meta") {
                return (
                  <p key={index} className="mb-8 text-sm text-ink-muted">
                    {block.text}
                  </p>
                );
              }

              if (block.type === "h") {
                return (
                  <h2
                    key={index}
                    className="mt-10 mb-4 text-xl text-ink first:mt-0"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "table") {
                return <PolicyTable key={index} rows={block.rows} />;
              }

              return (
                <p key={index} className="mb-3.5">
                  {block.text}
                </p>
              );
            })}
          </article>
        </Container>
      </div>

      <JsonLd
        data={breadcrumbSchema([{ name: POLICY_TITLE, path: "/policy" }])}
      />
    </>
  );
}
