import Image from "next/image";
import type { OrganizableEvent } from "@/lib/group-events";

type EventOfferingCardProps = {
  event: OrganizableEvent;
};

export function EventOfferingCard({ event }: EventOfferingCardProps) {
  return (
    <article className="rounded-sm overflow-hidden bg-white transition-transform hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative w-full h-56">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-7">
        <h3 className="font-display text-xl mb-3 text-palm-deep">{event.title}</h3>
        {event.highlights && event.highlights.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-4">
            {event.highlights.map((tag) => (
              <li
                key={tag}
                className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-sm bg-sand text-palm-deep"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm leading-relaxed text-ink/70">{event.description}</p>
      </div>
    </article>
  );
}
