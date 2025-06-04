import { dirname, resolve, extname } from "path";
import { fileURLToPath } from "url";
import { mkdir, readdir, copyFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "src");
const distDir = resolve(__dirname, "dist");
const outputPath = resolve(distDir, "icon.svg");

async function findFirstSvgFile(dirPath) {
  const files = await readdir(dirPath);
  const svgFile = files.find((file) => extname(file).toLowerCase() === ".svg");
  return svgFile ? resolve(dirPath, svgFile) : null;
}

async function copySvg() {
  await mkdir(distDir, { recursive: true });

  const inputPath = await findFirstSvgFile(srcDir);
  if (!inputPath) {
    console.error("srcフォルダ内にSVGファイルが見つかりませんでした");
    return;
  }

  await copyFile(inputPath, outputPath);
  console.log("icon.svg を出力しました");
}

copySvg();
