export type Room = {
  id?: string;
  slug: string;
  title: string;
  price: number;
  capacity: number;
  surface: number;
  description: string;
  images: string[];
  amenities: string[];
  services: string[];
  isFeatured?: boolean;
};
