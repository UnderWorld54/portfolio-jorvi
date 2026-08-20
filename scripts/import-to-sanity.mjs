/**
 * Importe le dump Strapi (contenu + images) dans Sanity.
 * Idempotent : relancer le script met à jour les documents au lieu d'en créer de nouveaux.
 *
 * Prérequis : NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *             et SANITY_API_WRITE_TOKEN dans .env
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";

const BACKUP_DIR = "/Users/angelo/Desktop/PERSO/strapi-backup";
const ASSET_CACHE = path.join(BACKUP_DIR, "sanity-assets.json");

const env = Object.fromEntries(
  (await fs.readFile(new URL("../.env", import.meta.url), "utf8"))
    .split("\n")
    .filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);

for (const key of ["NEXT_PUBLIC_SANITY_PROJECT_ID", "NEXT_PUBLIC_SANITY_DATASET", "SANITY_API_WRITE_TOKEN"]) {
  if (!env[key]) throw new Error(`Variable manquante dans .env : ${key}`);
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-08-20",
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const COLLECTIONS = {
  covers: { type: "cover", multiple: true },
  photos: { type: "photo", multiple: false },
  logos: { type: "logo", multiple: true },
  prints: { type: "print", multiple: true },
  videos: { type: "video", multiple: false },
};

const dump = JSON.parse(await fs.readFile(path.join(BACKUP_DIR, "strapi-dump.json"), "utf8"));

const uploaded = await fs
  .readFile(ASSET_CACHE, "utf8")
  .then(JSON.parse)
  .catch(() => ({}));

async function uploadAsset(media) {
  const key = media.hash ?? String(media.id);
  if (uploaded[key]) return uploaded[key];

  const filename = `${media.hash ?? media.id}${media.ext ?? path.extname(media.url)}`;
  const buffer = await fs.readFile(path.join(BACKUP_DIR, "assets", filename));

  const asset = await client.assets.upload("image", buffer, {
    filename: media.name ?? filename,
  });

  uploaded[key] = asset._id;
  await fs.writeFile(ASSET_CACHE, JSON.stringify(uploaded, null, 2));
  process.stdout.write(".");
  return asset._id;
}

function imageRef(assetId, key) {
  return { _type: "image", _key: key, asset: { _type: "reference", _ref: assetId } };
}

let created = 0;

for (const [collection, { type, multiple }] of Object.entries(COLLECTIONS)) {
  const items = dump[collection] ?? [];
  console.log(`\n${collection} → ${type} (${items.length})`);

  for (const item of items) {
    const doc = {
      _id: `strapi-${type}-${item.documentId}`,
      _type: type,
      publishedAt: item.publishedAt ?? item.createdAt,
    };

    for (const field of ["artist", "projectName", "date", "description"]) {
      const value = item[field];
      if (value != null && String(value).trim() !== "") doc[field] = String(value).trim();
    }

    if (type === "video" && item.link) doc.link = item.link;

    if (multiple) {
      const medias = (item.images ?? []).filter((m) => m?.url);
      if (medias.length === 0) {
        console.warn(`  ! ignoré (aucune image) : ${item.projectName ?? item.documentId}`);
        continue;
      }
      doc.images = [];
      for (const [i, media] of medias.entries()) {
        doc.images.push(imageRef(await uploadAsset(media), `img${i}`));
      }
    } else if (item.image?.url) {
      doc.image = { _type: "image", asset: { _type: "reference", _ref: await uploadAsset(item.image) } };
    } else if (type !== "video") {
      console.warn(`  ! ignoré (aucune image) : ${item.projectName ?? item.documentId}`);
      continue;
    }

    await client.createOrReplace(doc);
    created++;
  }
}

console.log(`\n\n${created} documents importés, ${Object.keys(uploaded).length} assets uploadés.`);
