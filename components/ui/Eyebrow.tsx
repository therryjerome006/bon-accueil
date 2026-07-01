import { FrondDivider } from "./FrondDivider";

export function Eyebrow({
  children,
  centered = false,
  inverted = false,
}: {
  children: React.ReactNode;
  centered?: boolean;
  inverted?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${centered ? "justify-center" : ""}`}>
      <FrondDivider inverted={inverted} />
      <span className={`text-xs tracking-[0.25em] uppercase ${inverted ? "text-sand" : "text-palm"}`}>
        {children}
      </span>
    </div>
  );
}
