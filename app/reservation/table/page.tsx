import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { TableReservationForm } from "@/components/TableReservationForm";
import { getRestaurantTableBySlug } from "@/lib/restaurant";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Réservation table — Bon Accueil Hotel",
  description: "Réservez une table au restaurant Bon Accueil, Jacmel.",
};

type PageProps = {
  searchParams: Promise<{ table?: string }>;
};

export default async function ReservationTablePage({ searchParams }: PageProps) {
  const { table: tableSlug } = await searchParams;

  if (!tableSlug) redirect("/restaurant");

  const table = await getRestaurantTableBySlug(tableSlug);
  if (!table) redirect("/restaurant");

  const user = await getUser();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Restaurant"
          title="Réserver une table"
          description={
            user
              ? "Connecté — la confirmation apparaîtra dans votre espace client."
              : "Sans compte, l'hôtel vous confirmera par email (envoyé manuellement par l'établissement)."
          }
        />

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <TableReservationForm table={table} isLoggedIn={Boolean(user)} accountEmail={user?.email} />
          <div className="mt-10">
            <Link href="/restaurant" className="text-sm text-palm-deep hover:opacity-70">
              ← Retour au restaurant
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
