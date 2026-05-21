import sharp from "sharp";
import pngToIco from "png-to-ico";
import { resolve } from "path";
import { writeFile } from "fs/promises";
import { distDir, findFirstSvgFile, ensureDistDir } from "./helpers.js";

const icoPath = resolve(distDir, "favicon.ico");

async function createFaviconIco() {
  await ensureDistDir();

  const inputPath = await findFirstSvgFile();
  if (!inputPath) {
    console.error("src フォルダ内に SVG ファイルが見つかりませんでした");
    return;
  }

  const pngBuffer = await sharp(inputPath).resize(32, 32).png().toBuffer();
  const icoBuffer = await pngToIco([pngBuffer]);
  await writeFile(icoPath, icoBuffer);

  console.log("favicon.ico（32px）を出力しました");
}

createFaviconIco();
