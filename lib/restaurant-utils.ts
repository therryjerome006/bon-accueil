import { firstImageUrl } from "@/lib/image-url";
import type { RestaurantTable } from "@/lib/restaurant.types";

export function getTableKey(table: RestaurantTable): string {
  return table.id ?? table.slug;
}

export function getTableReservationParam(table: RestaurantTable): string {
  return table.id ?? table.slug;
}

export function getTableImage(table: RestaurantTable): string {
  return firstImageUrl(table.images, "");
}
