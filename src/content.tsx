import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { z } from "zod";

async function* walkDir(dir: string): AsyncGenerator<string> {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walkDir(entry);
    else if (d.isFile()) yield entry;
  }
}

const CONTENT_DIR = "./content"; // Relative to the root of the project apparently

export async function listAllProviderSlugs() {
  const providers = new Set<string>();
  for await (const entry of walkDir(CONTENT_DIR)) {
    const providerName = entry.split("/")[1];
    if (providerName) providers.add(providerName);
  }

  return [...providers];
}

const metaSchema = z.object({
  status: z.union([z.literal("full_support"), z.literal("full_support")]),
});

export async function getProvider(provider: string) {
  const providerPath = path.join(CONTENT_DIR, provider);
  const [metaFile, noteFile] = await Promise.all([
    fs
      .readFile(path.join(providerPath, "meta.json"), {
        encoding: "utf-8",
      })
      .catch(() => notFound()),
    fs
      .readFile(path.join(providerPath, "note.md"), {
        encoding: "utf-8",
      })
      .catch(() => null),
  ]);

  return {
    meta: metaSchema.parse(JSON.parse(metaFile)),
    note: noteFile,
  };
}
