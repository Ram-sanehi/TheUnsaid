/* ─── Quote Canvas Generator ────────────────────────── */

export async function generateQuoteImage(
  text: string,
  chapterTitle: string,
  bookTitle = "The Girl Who Forgot Her Earrings",
): Promise<string> {
  const W = 1080;
  const H = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background
  const bgGrad = ctx.createRadialGradient(W * 0.4, H * 0.35, 0, W * 0.5, H * 0.5, W * 0.75);
  bgGrad.addColorStop(0, "#171b2a");
  bgGrad.addColorStop(0.6, "#0d111a");
  bgGrad.addColorStop(1, "#090c15");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle pink glow
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, 380);
  glow.addColorStop(0, "rgba(232, 140, 158, 0.07)");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Decorative top/bottom rule lines
  ctx.strokeStyle = "rgba(201, 168, 76, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 110);
  ctx.lineTo(W - 80, 110);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(80, H - 110);
  ctx.lineTo(W - 80, H - 110);
  ctx.stroke();

  // Small ornament top
  ctx.fillStyle = "rgba(201, 168, 76, 0.6)";
  ctx.font = "18px serif";
  ctx.textAlign = "center";
  ctx.fillText("✦", W / 2, 98);

  // Opening quote mark
  ctx.fillStyle = "rgba(232, 140, 158, 0.25)";
  ctx.font = `bold 180px "Playfair Display", Georgia, serif`;
  ctx.textAlign = "left";
  ctx.fillText("\u201C", 68, 310);

  // Quote text — word-wrapped
  ctx.fillStyle = "#E6E1D9";
  ctx.font = `italic 38px "Playfair Display", Georgia, serif`;
  ctx.textAlign = "center";
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  const maxWidth = W - 240;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const lineH = 58;
  const totalTextH = lines.length * lineH;
  let startY = (H - totalTextH) / 2 - 10;

  for (const l of lines) {
    ctx.fillText(l, W / 2, startY);
    startY += lineH;
  }

  // Separator
  ctx.strokeStyle = "rgba(201, 168, 76, 0.4)";
  ctx.lineWidth = 1;
  const sepY = startY + 40;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 40, sepY);
  ctx.lineTo(W / 2 + 40, sepY);
  ctx.stroke();

  // Chapter
  ctx.fillStyle = "rgba(201, 168, 76, 0.7)";
  ctx.font = `13px "Palatino Linotype", Georgia, serif`;
  ctx.letterSpacing = "3px";
  ctx.textAlign = "center";
  ctx.fillText(chapterTitle.toUpperCase(), W / 2, sepY + 30);

  // Book name
  ctx.fillStyle = "rgba(230, 225, 217, 0.4)";
  ctx.font = `italic 22px "Playfair Display", Georgia, serif`;
  ctx.fillText(bookTitle, W / 2, H - 130);

  // Bottom ornament
  ctx.fillStyle = "rgba(201, 168, 76, 0.5)";
  ctx.font = "16px serif";
  ctx.fillText("✦", W / 2, H - 100);

  return canvas.toDataURL("image/png");
}

export function downloadQuoteImage(dataUrl: string, filename = "quote.png") {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
