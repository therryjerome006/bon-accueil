"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type ToggleListProps = {
  label: string;
  items: string[];
};

function ToggleList({ label, items }: ToggleListProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-palm-soft/60 rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm tracking-wide text-palm-deep hover:bg-sand/40 transition-colors"
      >
        {label}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="px-5 pb-4 flex flex-col gap-2 border-t border-palm-soft/40">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-ink/80 pt-2 first:pt-3">
              <Check size={14} className="text-palm shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type RoomDetailPanelProps = {
  amenities: string[];
  services: string[];
};

export function RoomDetailPanel({ amenities, services }: RoomDetailPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <ToggleList label="Équipements" items={amenities} />
      <ToggleList label="Services" items={services} />
    </div>
  );
}
