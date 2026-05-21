import sharp from "sharp";
import { resolve } from "path";
import { distDir, findFirstSvgFile, ensureDistDir } from "./helpers.js";

async function createIconAny() {
  try {
    await ensureDistDir();

    const inputPath = await findFirstSvgFile();
    if (!inputPath) {
      console.error("src フォルダ内に SVG ファイルが見つかりませんでした");
      return;
    }

    // purpose: any はエッジトゥエッジ（padding なし）
    // ロゴ余白は SVG 側で制御する
    const sizes = [192, 512];
    for (const size of sizes) {
      await sharp(inputPath)
        .resize(size, size)
        .png()
        .toFile(resolve(distDir, `icon-${size}.png`));
      console.log(`icon-${size}.png を出力しました`);
    }
  } catch (err) {
    console.error("エラー:", err);
  }
}

createIconAny();
