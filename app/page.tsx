import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <img
          src="/hero.jpg"
          className="absolute w-full h-full object-cover"
          alt="hotel"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative text-center px-4">
          <h1 className="text-5xl font-bold mb-4">
            Bon-accueil Hotel 🌴
          </h1>
          <p className="mb-6 text-lg">
            Luxe, confort et détente au cœur du paradis
          </p>

          <Link
            href="/rooms"
            className="bg-green-600 px-6 py-3 rounded-lg text-white hover:bg-green-700"
          >
            Réserver maintenant
          </Link>
        </div>
      </section>

      {/* CHAMBRES */}
      <section className="p-10 bg-white">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Nos Chambres
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { img: '/room1.jpg', name: 'Chambre Deluxe', price: '120$' },
            { img: '/room2.jpg', name: 'Suite Premium', price: '200$' },
            { img: '/room3.jpg', name: 'Chambre Standard', price: '80$' },
          ].map((room, i) => (
            <div key={i} className="shadow rounded-lg overflow-hidden">
              <img src={room.img} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold">{room.name}</h3>
                <p className="text-green-600">{room.price}/nuit</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="p-10 bg-green-50">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Nos Services
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <img src="/service-spa.jpg" className="h-40 w-full object-cover rounded mb-4" />
            <h3 className="font-bold">Spa & Détente</h3>
          </div>

          <div className="bg-white p-6 rounded shadow text-center">
            <img src="/service-restaurant.jpg" className="h-40 w-full object-cover rounded mb-4" />
            <h3 className="font-bold">Restaurant</h3>
          </div>

          <div className="bg-white p-6 rounded shadow text-center">
            <img src="/service-activity.jpg" className="h-40 w-full object-cover rounded mb-4" />
            <h3 className="font-bold">Activités</h3>
          </div>
        </div>
      </section>

      {/* GOOGLE MAPS */}
      <section className="p-10 bg-white">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Nous trouver
        </h2>

        <div className="w-full h-[400px]">
          <iframe
            src="https://maps.google.com/maps?q=haiti&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full rounded"
            loading="lazy"
          />
        </div>
      </section>

      {/* WHATSAPP FLOAT */}
      <a
        href="https://wa.me/50944895405"
        target="_blank"
        className="fixed bottom-5 right-5 bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600"
      >
        💬
      </a>
    </>
  )
}