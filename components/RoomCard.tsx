import Link from "next/link";
import { AppMedia } from "@/components/AppMedia";
import type { Room } from "@/lib/rooms.types";
import { getRoomImage } from "@/lib/room-utils";

type RoomCardProps = {
  room: Room;
};

export function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="group rounded-sm overflow-hidden bg-white transition-transform hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative w-full h-64">
        <AppMedia
          src={getRoomImage(room)}
          alt={room.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          playing
        />
      </div>
      <div className="p-7">
        <h3 className="font-display text-xl mb-2 text-palm-deep">{room.title}</h3>
        <p className="text-xs uppercase tracking-wide mb-4 text-palm">
          {room.surface} m² · {room.capacity} pers.
        </p>
        <p className="text-sm leading-relaxed text-ink/70 mb-5 line-clamp-2">{room.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg text-ink">
            {room.price} $ <span className="text-xs text-ink/50">/ nuit</span>
          </span>
          <Link
            href={`/chambres/${room.slug}`}
            className="px-4 py-2 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors"
          >
            Détails chambre
          </Link>
        </div>
      </div>
    </article>
  );
}
