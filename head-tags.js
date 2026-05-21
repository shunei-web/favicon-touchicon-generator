import { resolve } from "path";
import { writeFile } from "fs/promises";
import { distDir, ensureDistDir } from "./helpers.js";
import { loadConfig } from "./config.js";

async function createHeadTags() {
  try {
    await ensureDistDir();

    const config = await loadConfig();

    // icon_base_path の末尾スラッシュを正規化（manifest.js と同じ処理）
    const basePath = config.icon_base_path.replace(/\/$/, "");
    const themeColor = config.theme_color;

    const html = `<link rel="icon" href="${basePath}/favicon.ico" sizes="32x32">
<link rel="icon" href="${basePath}/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${basePath}/apple-touch-icon.png">
<link rel="manifest" href="${basePath}/manifest.webmanifest">
<meta name="theme-color" content="${themeColor}">

<!-- iOS PWA splash screens -->
<link rel="apple-touch-startup-image" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="${basePath}/ios-splash-1290x2796.png">
<link rel="apple-touch-startup-image" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="${basePath}/ios-splash-1284x2778.png">
<link rel="apple-touch-startup-image" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="${basePath}/ios-splash-1170x2532.png">
<link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="${basePath}/ios-splash-1125x2436.png">
<link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="${basePath}/ios-splash-750x1334.png">
<link rel="apple-touch-startup-image" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="${basePath}/ios-splash-2048x2732.png">
<link rel="apple-touch-startup-image" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="${basePath}/ios-splash-1668x2388.png">
<link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="${basePath}/ios-splash-1536x2048.png">
`;

    const outputPath = resolve(distDir, "head-tags.html");
    await writeFile(outputPath, html);
    console.log("head-tags.html を出力しました");
  } catch (err) {
    console.error("エラー:", err);
  }
}

createHeadTags();
