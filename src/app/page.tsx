import { listAllProviderSlugs } from "@/content";
import Link from "next/link";

export const dynamic = "error";

export default async function Home() {
  const providerSlugs = await listAllProviderSlugs();
  return (
    <ul>
      {providerSlugs.map((slug) => (
        <li key={slug}>
          <Link href={`/p/${slug}`}>{slug}</Link>
        </li>
      ))}
    </ul>
  );
}
