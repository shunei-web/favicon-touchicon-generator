import sharp from "sharp";
import pngToIco from "png-to-ico";
import { dirname, resolve, extname } from "path";
import { fileURLToPath } from "url";
import { mkdir, readdir, writeFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "src");
const distDir = resolve(__dirname, "dist");
const pngPath = resolve(distDir, "favicon-32.png");
const icoPath = resolve(distDir, "favicon.ico");

async function findFirstSvgFile(dirPath) {
  const files = await readdir(dirPath);
  const svgFile = files.find((file) => extname(file).toLowerCase() === ".svg");
  return svgFile ? resolve(dirPath, svgFile) : null;
}

async function createFaviconIco() {
  await mkdir(distDir, { recursive: true });

  const inputPath = await findFirstSvgFile(srcDir);
  if (!inputPath) {
    console.error("srcフォルダ内にSVGファイルが見つかりませんでした");
    return;
  }

  const pngBuffer = await sharp(inputPath).resize(32, 32).png().toBuffer();

  const icoBuffer = await pngToIco([pngBuffer]);
  await writeFile(icoPath, icoBuffer);

  console.log("favicon.ico（32px）を出力しました");
}

createFaviconIco();
