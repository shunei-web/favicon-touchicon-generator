import { resolve } from "path";
import { writeFile } from "fs/promises";
import { distDir, ensureDistDir } from "./helpers.js";
import { loadConfig } from "./config.js";

async function createManifest() {
  try {
    await ensureDistDir();

    const config = await loadConfig();

    // icon_base_path の末尾スラッシュを正規化（重複を防ぐ）
    const basePath = config.icon_base_path.replace(/\/$/, "");

    const manifest = {
      name: config.name,
      short_name: config.short_name,
      description: config.description,
      start_url: config.start_url,
      display: config.display,
      orientation: config.orientation,
      background_color: config.background_color,
      theme_color: config.theme_color,
      lang: config.lang,
      scope: config.scope,
      icons: [
        {
          src: `${basePath}/icon-192.png`,
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: `${basePath}/icon-512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: `${basePath}/icon-mask-512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    };

    const outputPath = resolve(distDir, "manifest.webmanifest");
    await writeFile(outputPath, JSON.stringify(manifest, null, 2));
    console.log("manifest.webmanifest を出力しました");
  } catch (err) {
    console.error("エラー:", err);
  }
}

createManifest();
