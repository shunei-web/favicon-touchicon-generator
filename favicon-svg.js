import { resolve } from "path";
import { copyFile } from "fs/promises";
import { distDir, findFirstSvgFile, ensureDistDir } from "./helpers.js";

const outputPath = resolve(distDir, "favicon.svg");

async function createFaviconSvg() {
  await ensureDistDir();

  const inputPath = await findFirstSvgFile();
  if (!inputPath) {
    console.error("src フォルダ内に SVG ファイルが見つかりませんでした");
    return;
  }

  await copyFile(inputPath, outputPath);
  console.log("favicon.svg を出力しました");
}

createFaviconSvg();
