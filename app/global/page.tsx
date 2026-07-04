import Link from "next/link";
import { formatMoney } from "@/lib/utils";

// Standard exchange rate for mock display
const EXCHANGE_RATE = 130; 

const FEATURED_GUIDES = [
  {
    id: "g1",
    name: "Captain Omar",
    specialty: "Marine Park & Snorkeling",
    rating: 4.9,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    price: Math.round(3500 / EXCHANGE_RATE),
  },
  {
    id: "g2",
    name: "Halima Safari",
    specialty: "Marafa Hell's Kitchen & Culture",
    rating: 5.0,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    price: Math.round(4500 / EXCHANGE_RATE),
  },
  {
    id: "g3",
    name: "Bwana Said",
    specialty: "Deep Sea Fishing & Dhow Cruises",
    rating: 4.8,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    price: Math.round(6000 / EXCHANGE_RATE),
  },
];

const FEATURED_PARTNERS = [
  {
    name: "Driftwood Beach Club",
    type: "Hotel & Dining",
    location: "Silversands Beach",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=300",
    description: "Partnered since Aug 2024. Driftwood refers international guests directly through our platform and returns a 10% commission on confirmed bookings.",
  },
  {
    name: "Temple Point Resort",
    type: "Luxury Resort",
    location: "Mida Creek",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300",
    description: "Partnered since Oct 2024. Guests enjoy direct booking access with an 12% commission returned to our community vacation pool.",
  },
];

export default function GlobalPage() {
  return (
    <div className="min-h-screen bg-sand-light text-ink">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-ocean/10 bg-sand-light/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-semibold italic text-ocean">
            Twende Malindi <span className="text-xs font-mono font-normal not-italic bg-coral/10 text-coral px-2 py-0.5 rounded-full ml-1">Global</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/partners" className="text-sm font-medium text-ocean hover:text-coral transition">
              Partners
            </Link>
            <Link href="/register" className="text-sm font-medium text-ocean hover:text-coral transition">
              Join as Partner/Guide
            </Link>
            <Link href="/" className="rounded-full border border-ocean/20 px-4 py-1.5 text-xs font-medium text-ocean hover:bg-ocean hover:text-sand-light transition">
              🇰🇪 Local Site (KES)
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-ocean px-5 py-2 text-sm font-medium text-sand transition hover:bg-ocean-light"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-coral font-semibold">International Portal</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-bold tracking-tight text-ocean md:text-6xl">
          Experience the Magic of the <span className="italic text-coral font-medium">Swahili Coast</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ocean/80">
          Plan group journeys, book vetted guides, and pay in USD with full support for international credit cards. Perfect for diaspora and global visitors.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/groups/new"
            className="rounded-full bg-coral px-8 py-3.5 font-medium text-white shadow-lg shadow-coral/20 transition hover:bg-coral/95 hover:scale-[1.02]"
          >
            Start a USD Group Fund
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-white border border-ocean/20 px-8 py-3.5 font-medium text-ocean transition hover:bg-ocean/5"
          >
            Manage Dashboard
          </Link>
        </div>

        {/* Demo Box */}
        <div className="mx-auto mt-16 max-w-lg rounded-sail border border-ocean/15 bg-white p-6 shadow-xl shadow-ocean/5 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-medium text-ocean">Malindi Family Reunion 🌊</h3>
            <span className="rounded-full bg-lagoon/10 px-3 py-1 text-xs font-semibold text-lagoon">USD Pool</span>
          </div>
          <p className="mt-1 text-xs text-ocean/60">Organized by Amani Family · 4 contributors</p>
          
          <div className="mt-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-xl font-bold text-ocean">{formatMoney(750, "USD")}</span>
              <span className="font-mono text-xs text-ocean/60">of {formatMoney(1500, "USD")}</span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-sail bg-ocean/10">
              <div className="absolute inset-y-0 left-0 rounded-sail bg-gradient-to-r from-lagoon to-coral w-[50%]" />
            </div>
            <div className="mt-2 text-xs text-ocean/60">50% of target reached</div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl font-bold text-ocean text-center mb-12">Top-Rated Tour Guides</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_GUIDES.map((guide) => (
              <div key={guide.id} className="rounded-sail border border-ocean/10 bg-sand-light/35 p-5 hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="h-16 w-16 rounded-full object-cover border border-ocean/10"
                  />
                  <div>
                    <h3 className="font-display text-lg font-bold text-ocean">{guide.name}</h3>
                    <p className="text-xs text-ocean/70">{guide.specialty}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-xs text-gold">★</span>
                      <span className="text-xs font-semibold text-ocean">{guide.rating}</span>
                      <span className="text-xs text-ocean/50">({guide.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-ocean/5 pt-4">
                  <span className="text-xs text-ocean/60">Tours from</span>
                  <span className="font-mono text-sm font-bold text-ocean">{formatMoney(guide.price, "USD")}/day</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Showcase */}
      <section className="py-20 bg-sand/20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl font-bold text-ocean text-center mb-12">Our Coastal Accommodation Partners</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {FEATURED_PARTNERS.map((partner) => (
              <div key={partner.name} className="flex flex-col overflow-hidden rounded-sail border border-ocean/10 bg-white sm:flex-row shadow-xs">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="h-48 w-full object-cover sm:w-48"
                />
                <div className="flex flex-col justify-between p-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-lagoon font-mono">{partner.type}</span>
                    <h3 className="mt-1 font-display text-xl font-bold text-ocean">{partner.name}</h3>
                    <p className="text-xs text-ocean/60">{partner.location}</p>
                    <p className="mt-3 text-xs italic text-ocean/70 leading-relaxed bg-sand-light/60 p-3 rounded-sail border border-ocean/5">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ocean/10 bg-ocean text-sand-light py-12">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-sand/50">
          <p>Twende Malindi — Global USD Travel Portal</p>
          <p className="mt-4">&copy; {new Date().getFullYear()} Twende Malindi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
