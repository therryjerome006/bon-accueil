import type { Metadata } from "next";
import Link from "next/link";
import { AppImage } from "@/components/AppImage";
import { notFound } from "next/navigation";
import { Users, Maximize2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoomDetailPanel } from "@/components/RoomDetailPanel";
import { getRoomBySlug, getRooms, getRoomImage } from "@/lib/rooms";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const rooms = await getRooms();
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return { title: "Chambre introuvable" };
  return {
    title: `${room.title} — Bon Accueil Hotel`,
    description: room.description,
  };
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);

  if (!room) notFound();

  const mainImage = getRoomImage(room);

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          <Link
            href="/chambres"
            className="inline-flex items-center gap-2 text-sm text-palm-deep hover:opacity-70 mb-8"
          >
            <ArrowLeft size={15} /> Retour aux chambres
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <div className="relative w-full h-80 md:h-[480px] rounded-sm overflow-hidden">
                <AppImage
                  src={mainImage}
                  alt={room.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {room.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {room.images.slice(1, 4).map((img) => (
                    <div key={img} className="relative h-24 rounded-sm overflow-hidden">
                      <AppImage
                        src={img}
                        alt={room.title}
                        fill
                        sizes="(max-width: 1024px) 33vw, 15vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="font-display text-3xl md:text-4xl text-palm-deep mb-4">{room.title}</h1>

              <div className="flex flex-wrap gap-6 mb-6 text-sm text-ink/70">
                <span className="flex items-center gap-2">
                  <Maximize2 size={16} className="text-palm" />
                  {room.surface} m²
                </span>
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-palm" />
                  {room.capacity} personne{room.capacity > 1 ? "s" : ""}
                </span>
                <span className="font-display text-xl text-ink">
                  {room.price} $ <span className="text-xs text-ink/50">/ nuit</span>
                </span>
              </div>

              <p className="leading-relaxed text-ink/80 mb-8">{room.description}</p>

              <RoomDetailPanel amenities={room.amenities} services={room.services} />

              <Link
                href={`/reservation/chambre?room=${room.slug}`}
                className="mt-8 inline-flex px-8 py-3.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors"
              >
                Réserver
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
