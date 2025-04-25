export function genRandomColor(): string {
  // Matiz entre 0 e 360 (cor base)
  const hue = Math.floor(Math.random() * 360);
  // Saturação e luminosidade altas para cores vivas
  const saturation = 100;
  const lightness = 50;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
