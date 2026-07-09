// Renders a deterministic fake QR-code pattern for display purposes
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

interface FakeQRProps {
  value: string;
  size?: number;
}

export default function FakeQR({ value, size = 160 }: FakeQRProps) {
  const CELLS = 21;
  const cell = size / CELLS;
  const seed = hash(value);

  const isFixed = (r: number, c: number) => {
    // Corner finder patterns
    if ((r < 7 && c < 7) || (r < 7 && c >= CELLS - 7) || (r >= CELLS - 7 && c < 7)) return true;
    // Timing
    if (r === 6 || c === 6) return (r + c) % 2 === 0;
    return false;
  };

  const isDark = (r: number, c: number) => {
    if (isFixed(r, c)) {
      // Finder: border = dark, inner = light, center = dark
      const inCorner = (rr: number, cc: number) => rr >= 0 && rr < 7 && cc >= 0 && cc < 7;
      if (inCorner(r, c)) {
        if (r === 0 || r === 6 || c === 0 || c === 6) return true;
        if (r === 1 || r === 5 || c === 1 || c === 5) return false;
        return true;
      }
      if (inCorner(r, c - (CELLS - 7))) {
        const cc = c - (CELLS - 7);
        if (r === 0 || r === 6 || cc === 0 || cc === 6) return true;
        if (r === 1 || r === 5 || cc === 1 || cc === 5) return false;
        return true;
      }
      if (inCorner(r - (CELLS - 7), c)) {
        const rr = r - (CELLS - 7);
        if (rr === 0 || rr === 6 || c === 0 || c === 6) return true;
        if (rr === 1 || rr === 5 || c === 1 || c === 5) return false;
        return true;
      }
      return (r + c) % 2 === 0;
    }
    const bit = (seed >>> ((r * CELLS + c) % 32)) & 1;
    return bit === 1;
  };

  const cells: { r: number; c: number; dark: boolean }[] = [];
  for (let r = 0; r < CELLS; r++) {
    for (let c = 0; c < CELLS; c++) {
      cells.push({ r, c, dark: isDark(r, c) });
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", imageRendering: "pixelated" }}>
      <rect width={size} height={size} fill="white" />
      {cells.map(({ r, c, dark }) =>
        dark ? (
          <rect
            key={`${r}-${c}`}
            x={c * cell}
            y={r * cell}
            width={cell}
            height={cell}
            fill="#111"
          />
        ) : null
      )}
    </svg>
  );
}
