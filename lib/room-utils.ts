import { firstImageUrl } from "@/lib/image-url";
import type { Room } from "@/lib/rooms.types";

export function getRoomImage(room: Room): string {
  return firstImageUrl(room.images, "");
}
