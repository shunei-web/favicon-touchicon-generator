import { resolve, dirname, extname } from "path";
import { fileURLToPath } from "url";
import { mkdir, readdir } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const srcDir = resolve(__dirname, "src");
export const distDir = resolve(__dirname, "dist");

/**
 * src フォルダから最初の SVG ファイルを探す
 * @param {string} [dirPath] - 検索ディレクトリ（省略時は srcDir）
 * @returns {Promise<string|null>} 絶対パス or null
 */
export async function findFirstSvgFile(dirPath = srcDir) {
  const files = await readdir(dirPath);
  const svgFile = files.find((file) => extname(file).toLowerCase() === ".svg");
  return svgFile ? resolve(dirPath, svgFile) : null;
}

/**
 * dist ディレクトリを作成（既存ならスキップ）
 */
export async function ensureDistDir() {
  await mkdir(distDir, { recursive: true });
}

/**
 * "#RRGGBB" / "#RGB" → { r, g, b }
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number }}
 */
export function hexToRgb(hex) {
  if (typeof hex !== "string") {
    throw new Error(`color は文字列で指定してください: ${hex}`);
  }
  let value = hex.trim().replace(/^#/, "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`color は #RGB または #RRGGBB 形式: ${hex}`);
  }
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}
