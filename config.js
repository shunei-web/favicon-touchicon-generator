import { readFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = resolve(__dirname, "config.json");

export async function loadConfig() {
  try {
    const content = await readFile(configPath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error(
      "エラー: config.json が見つかりません。config.example.json をコピーして編集してください。"
    );
    console.error("  cp config.example.json config.json");
    process.exit(1);
  }
}
