import sharp from "sharp";
import { resolve } from "path";
import { distDir, findFirstSvgFile, ensureDistDir, hexToRgb } from "./helpers.js";
import { loadConfig } from "./config.js";

async function createIconMaskable() {
  try {
    await ensureDistDir();

    const config = await loadConfig();
    const inputPath = await findFirstSvgFile();
    if (!inputPath) {
      console.error("src フォルダ内に SVG ファイルが見つかりませんでした");
      return;
    }

    // Coliss 2026 仕様 + W3C maskable icon: safe zone は 409×409（中央 80%）
    // Android adaptive icon がマスク（円・角丸・しずく等）で切り抜いても
    // 重要な絵柄が欠けないよう 51px の余白を四辺に確保する
    const CANVAS = 512;
    const SAFE_ZONE = 409; // Coliss 仕様（512×0.8 = 409.6 を floor、安全領域は 409×409 の正方形）
    const OFFSET = Math.floor((CANVAS - SAFE_ZONE) / 2); // (512-409)/2 = 51

    // ロゴを safe zone サイズにリサイズ（透過保持）
    const logoBuffer = await sharp(inputPath)
      .resize(SAFE_ZONE, SAFE_ZONE, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    // background_color で塗りつぶした 512×512 canvas を生成し、ロゴを合成
    const { r, g, b } = hexToRgb(config.background_color);

    await sharp({
      create: {
        width: CANVAS,
        height: CANVAS,
        channels: 4,
        background: { r, g, b, alpha: 255 },
      },
    })
      .composite([{ input: logoBuffer, top: OFFSET, left: OFFSET }])
      .png()
      .toFile(resolve(distDir, "icon-mask-512.png"));

    console.log("icon-mask-512.png を出力しました");
  } catch (err) {
    console.error("エラー:", err);
  }
}

createIconMaskable();
