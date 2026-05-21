import sharp from "sharp";
import { resolve } from "path";
import { distDir, findFirstSvgFile, ensureDistDir, hexToRgb } from "./helpers.js";
import { loadConfig } from "./config.js";

// portrait のみ（landscape 非対応）
const splashSizes = [
  { width: 1290, height: 2796 }, // iPhone 14 Pro Max
  { width: 1284, height: 2778 }, // iPhone 14 Plus / 13 Pro Max
  { width: 1170, height: 2532 }, // iPhone 14 / 13 / 12
  { width: 1125, height: 2436 }, // iPhone 11 Pro / X
  { width: 750,  height: 1334 }, // iPhone SE / 8
  { width: 2048, height: 2732 }, // iPad Pro 12.9"
  { width: 1668, height: 2388 }, // iPad Pro 11"
  { width: 1536, height: 2048 }, // iPad
];

async function createIosSplash() {
  try {
    await ensureDistDir();

    const inputPath = await findFirstSvgFile();
    if (!inputPath) {
      console.error("src フォルダ内に SVG ファイルが見つかりませんでした");
      return;
    }

    const config = await loadConfig();
    const { r, g, b } = hexToRgb(config.background_color);

    for (const { width, height } of splashSizes) {
      // ロゴサイズ = canvas 短辺の 30%（Coliss 2026 仕様準拠の保守的設計）
      const logoSize = Math.floor(Math.min(width, height) * 0.3);

      // ロゴを logoSize × logoSize にリサイズ（fit: contain で SVG アスペクト比保持）
      const logoBuffer = await sharp(inputPath)
        .resize(logoSize, logoSize, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      // 中央配置のオフセット計算
      const left = Math.floor((width - logoSize) / 2);
      const top = Math.floor((height - logoSize) / 2);

      const outputPath = resolve(distDir, `ios-splash-${width}x${height}.png`);

      // background_color で全面塗りつぶし + ロゴを中央合成
      await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: { r, g, b, alpha: 1 },
        },
      })
        .composite([{ input: logoBuffer, top, left }])
        .png()
        .toFile(outputPath);

      console.log(`ios-splash-${width}x${height}.png を出力しました`);
    }
  } catch (err) {
    console.error("エラー:", err);
  }
}

createIosSplash();
