export function FrondDivider({ flip = false, inverted = false }: { flip?: boolean; inverted?: boolean }) {
  const color = inverted ? "#E8DCC4" : "#3F7259";
  return (
    <svg width="120" height="28" viewBox="0 0 120 28" fill="none" className={flip ? "-scale-x-100" : ""}>
      <path
        d="M2 24C20 24 26 6 44 6C36 14 34 22 40 24C54 18 58 6 78 4C68 12 66 20 74 24C92 22 102 12 118 4"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="44" cy="6" r="2" fill={color} />
      <circle cx="78" cy="4" r="2" fill={color} />
    </svg>
  );
}
