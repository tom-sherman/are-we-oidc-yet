import Markdown from "@/markdown";
import { getProvider, listAllProviderSlugs } from "@/content";

export const dynamic = "error";

export async function generateStaticParams(): Promise<Params[]> {
  return (await listAllProviderSlugs()).map((provider) => ({ provider }));
}

interface Params {
  provider: string;
}

export default async function Provider({ params }: { params: Params }) {
  const { meta, note } = await getProvider(params.provider);

  return (
    <>
      <pre>{JSON.stringify(meta)}</pre>
      {note ? <Markdown content={note} /> : null}
    </>
  );
}
