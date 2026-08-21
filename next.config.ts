import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Chemins locaux + domaines courants ; les autres URLs passent par AppImage (<img> natif)
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
  },
};

export default nextConfig;
