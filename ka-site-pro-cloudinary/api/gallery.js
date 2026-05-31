import { v2 as cloudinary } from "cloudinary";

const DEFAULT_FOLDER = "ka-realisations";
const MAX_ASSETS = Number.parseInt(process.env.CLOUDINARY_MAX_ASSETS || "500", 10);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function isConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function normalizeFolder(folder) {
  const value = (folder || DEFAULT_FOLDER).trim().replace(/^\/+|\/+$/g, "");

  if (!/^[a-zA-Z0-9/_-]+$/.test(value)) {
    throw new Error("invalid_cloudinary_folder");
  }

  return value;
}

function categoryFromAsset(asset) {
  const raw = `${asset.public_id} ${(asset.tags || []).join(" ")}`.toLowerCase();

  if (raw.includes("terrassement") || raw.includes("terrain")) return "Terrassement";
  if (raw.includes("bois") || raw.includes("wood") || raw.includes("terrasse-bois")) return "Terrasse bois";
  if (raw.includes("plot") || raw.includes("dalle") || raw.includes("slab")) return "Dalle sur plot";
  if (raw.includes("piscine") || raw.includes("pool")) return "Contour piscine";
  if (raw.includes("avant") || raw.includes("apres") || raw.includes("after") || raw.includes("before")) {
    return "Avant / Après";
  }

  return "Réalisation";
}

function titleFromPublicId(publicId) {
  const filename = publicId.split("/").pop() || "realisation-ka";
  const clean = filename
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return "Réalisation KA";

  return clean.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

async function fetchCloudinaryResources({ folder, tag }) {
  const resources = [];
  let nextCursor;

  do {
    const options = {
      resource_type: "image",
      max_results: 100,
      direction: "desc",
      next_cursor: nextCursor,
    };

    const result = tag
      ? await cloudinary.api.resources_by_tag(tag, options)
      : await cloudinary.api.resources({
          ...options,
          type: "upload",
          prefix: `${folder}/`,
        });

    resources.push(...(result.resources || []));
    nextCursor = result.next_cursor;
  } while (nextCursor && resources.length < MAX_ASSETS);

  return resources
    .slice(0, MAX_ASSETS)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function mapAsset(asset) {
  return {
    id: asset.asset_id,
    publicId: asset.public_id,
    title: titleFromPublicId(asset.public_id),
    category: categoryFromAsset(asset),
    width: asset.width,
    height: asset.height,
    createdAt: asset.created_at,
    thumb: cloudinary.url(asset.public_id, {
      secure: true,
      transformation: [
        { width: 760, height: 560, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    }),
    full: cloudinary.url(asset.public_id, {
      secure: true,
      transformation: [
        { width: 1800, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    }),
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  if (!isConfigured()) {
    return res.status(200).json({
      configured: false,
      count: 0,
      images: [],
    });
  }

  try {
    const folder = normalizeFolder(process.env.CLOUDINARY_FOLDER);
    const tag = process.env.CLOUDINARY_TAG?.trim();
    const resources = await fetchCloudinaryResources({ folder, tag });
    const images = resources.map(mapAsset);

    return res.status(200).json({
      configured: true,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error("cloudinary_gallery_error", {
      message: error.message,
      name: error.name,
    });

    return res.status(500).json({
      configured: true,
      error: "gallery_unavailable",
      images: [],
    });
  }
}
