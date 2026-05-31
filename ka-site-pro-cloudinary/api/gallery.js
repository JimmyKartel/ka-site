import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function categoryFromAsset(asset) {
  const raw = `${asset.public_id} ${(asset.tags || []).join(" ")}`.toLowerCase();
  if (raw.includes("bois") || raw.includes("wood") || raw.includes("terrasse-bois")) return "Terrasse bois";
  if (raw.includes("plot") || raw.includes("dalle") || raw.includes("slab")) return "Dalle sur plot";
  if (raw.includes("piscine") || raw.includes("pool")) return "Contour piscine";
  if (raw.includes("avant") || raw.includes("apres") || raw.includes("after") || raw.includes("before")) return "Avant / Après";
  return "Réalisation";
}

export default async function handler(req, res) {
  try {
    const folder = process.env.CLOUDINARY_FOLDER || "ka-realisations";
    const tag = process.env.CLOUDINARY_TAG;

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(200).json({ images: [], configured: false });
    }

    let result;
    if (tag) {
      result = await cloudinary.api.resources_by_tag(tag, {
        resource_type: "image",
        max_results: 100,
        direction: "desc",
      });
    } else {
      result = await cloudinary.api.resources({
        type: "upload",
        resource_type: "image",
        prefix: `${folder}/`,
        max_results: 100,
        direction: "desc",
      });
    }

    const images = (result.resources || []).map((asset) => ({
      id: asset.asset_id,
      publicId: asset.public_id,
      category: categoryFromAsset(asset),
      width: asset.width,
      height: asset.height,
      createdAt: asset.created_at,
      thumb: cloudinary.url(asset.public_id, {
        secure: true,
        transformation: [
          { width: 720, height: 520, crop: "fill", gravity: "auto" },
          { quality: "auto", fetch_format: "auto" }
        ],
      }),
      full: cloudinary.url(asset.public_id, {
        secure: true,
        transformation: [
          { width: 1600, crop: "limit" },
          { quality: "auto", fetch_format: "auto" }
        ],
      }),
    }));

    res.status(200).json({ images, configured: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur Cloudinary", details: error.message });
  }
}
