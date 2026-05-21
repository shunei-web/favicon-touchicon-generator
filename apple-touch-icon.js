import sharp from "sharp";
import { resolve } from "path";
import { distDir, findFirstSvgFile, ensureDistDir, hexToRgb } from "./helpers.js";
import { loadConfig } from "./config.js";

const outputPath = resolve(distDir, "apple-touch-icon.png");

async function createAppleTouchIcon() {
  try {
    await ensureDistDir();

    const inputPath = await findFirstSvgFile();
    if (!inputPath) {
      console.error("src フォルダ内に SVG ファイルが見つかりませんでした");
      return;
    }

    const config = await loadConfig();
    const { r, g, b } = hexToRgb(config.background_color);

    // 140×140 にロゴをリサイズ（fit: contain で縦横比を保持）
    const logoBuffer = await sharp(inputPath)
      .resize(140, 140, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    // 180×180 を config.background_color で塗りつぶし + 140 ロゴを center 配置（20px padding）
    // iOS Safari「ホーム画面に追加」での透明余白問題を回避
    // 透明背景のままだと wallpaper が透けて表示される・iOS 自動角丸の内側に透明余白が残る
    await sharp({
      create: {
        width: 180,
        height: 180,
        channels: 4,
        background: { r, g, b, alpha: 1 },
      },
    })
      .composite([{ input: logoBuffer, top: 20, left: 20 }])
      .png()
      .toFile(outputPath);

    console.log("apple-touch-icon.png（180×180、background_color 塗りつぶし）を出力しました");
  } catch (err) {
    console.error("エラー:", err);
  }
}

createAppleTouchIcon();
