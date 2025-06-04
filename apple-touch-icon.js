import sharp from "sharp";
import { dirname, resolve, extname } from "path";
import { fileURLToPath } from "url";
import { mkdir, readdir } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "src");
const distDir = resolve(__dirname, "dist");
const outputPath = resolve(distDir, "apple-touch-icon.png");

async function findFirstSvgFile(dirPath) {
  const files = await readdir(dirPath);
  const svgFile = files.find((file) => extname(file).toLowerCase() === ".svg");
  return svgFile ? resolve(dirPath, svgFile) : null;
}

async function createAppleTouchIcon() {
  try {
    await mkdir(distDir, { recursive: true });

    const inputPath = await findFirstSvgFile(srcDir);
    if (!inputPath) {
      console.error("srcフォルダ内にSVGファイルが見つかりませんでした");
      return;
    }

    const resizedBuffer = await sharp(inputPath)
      .resize(140, 140)
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: 180,
        height: 180,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: resizedBuffer,
          top: 20,
          left: 20,
        },
      ])
      .png()
      .toFile(outputPath);

    console.log("apple-touch-icon.png を出力しました");
  } catch (err) {
    console.error("エラー:", err);
  }
}

createAppleTouchIcon();
