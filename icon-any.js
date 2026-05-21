import sharp from "sharp";
import { dirname, resolve, extname } from "path";
import { fileURLToPath } from "url";
import { mkdir, readdir } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "src");
const distDir = resolve(__dirname, "dist");

async function findFirstSvgFile(dirPath) {
  const files = await readdir(dirPath);
  const svgFile = files.find((file) => extname(file).toLowerCase() === ".svg");
  return svgFile ? resolve(dirPath, svgFile) : null;
}

async function createIconAny() {
  try {
    await mkdir(distDir, { recursive: true });

    const inputPath = await findFirstSvgFile(srcDir);
    if (!inputPath) {
      console.error("srcフォルダ内にSVGファイルが見つかりませんでした");
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
