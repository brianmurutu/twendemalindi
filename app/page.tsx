import Link from "next/link";
import { formatMoney } from "@/lib/utils";

// Static premium mock data to populate the platform beautifully out of the box
const FEATURED_GUIDES = [
  {
    id: "g1",
    name: "Captain Omar",
    specialty: "Marine Park & Snorkeling",
    rating: 4.9,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    price: 3500,
  },
  {
    id: "g2",
    name: "Halima Safari",
    specialty: "Marafa Hell's Kitchen & Culture",
    rating: 5.0,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    price: 4500,
  },
  {
    id: "g3",
    name: "Bwana Said",
    specialty: "Deep Sea Fishing & Dhow Cruises",
    rating: 4.8,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    price: 6000,
  },
];

const FEATURED_PARTNERS = [
  {
    name: "Driftwood Beach Club",
    type: "Hotel / Resort",
    location: "Silversands Beach",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=300",
    description: "Partnered since Aug 2024. Driftwood refers guests directly through our platform and returns a 10% commission on confirmed bookings.",
  },
  {
    name: "Temple Point Resort",
    type: "Luxury Resort",
    location: "Mida Creek",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300",
    description: "Partnered since Oct 2024. Guests enjoy direct booking access with an 12% commission returned to our community vacation pool.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sand-light text-ink">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-ocean/10 bg-sand-light/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-semibold italic text-ocean">
            Twende Malindi
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/partners" className="text-sm font-medium text-ocean hover:text-coral transition">
              Partners
            </Link>
            <Link href="/register" className="text-sm font-medium text-ocean hover:text-coral transition">
              Join as Partner/Guide
            </Link>
            <Link href="/global" className="rounded-full border border-ocean/20 px-4 py-1.5 text-xs font-medium text-ocean hover:bg-ocean hover:text-sand-light transition">
              🇺🇸 Global Site (USD)
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
        <p className="font-mono text-xs uppercase tracking-widest text-coral">Save Together, Travel Together</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-bold tracking-tight text-ocean md:text-6xl">
          Watch the tide rise on your <span className="italic text-coral font-medium">Malindi getaway</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ocean/80">
          Create a shared trip fund, pool contributions with friends, and book vetted local guides and beachfront hotels in one seamless ecosystem.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/groups/new"
            className="rounded-full bg-coral px-8 py-3.5 font-medium text-white shadow-lg shadow-coral/20 transition hover:bg-coral/95 hover:scale-[1.02]"
          >
            Start a Group Trip
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-white border border-ocean/20 px-8 py-3.5 font-medium text-ocean transition hover:bg-ocean/5"
          >
            Manage Your Goal
          </Link>
        </div>

        {/* Dynamic Demo Progress Bar Container */}
        <div className="mx-auto mt-16 max-w-lg rounded-sail border border-ocean/15 bg-white p-6 shadow-xl shadow-ocean/5 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-medium text-ocean">Malindi August Takeover 🌊</h3>
            <span className="rounded-full bg-lagoon/10 px-3 py-1 text-xs font-semibold text-lagoon">Demo Fund</span>
          </div>
          <p className="mt-1 text-xs text-ocean/60">Organized by Campus Crew · 6 Friends contributing</p>
          
          <div className="mt-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-xl font-bold text-ocean">{formatMoney(62500)}</span>
              <span className="font-mono text-xs text-ocean/60">of {formatMoney(100000)}</span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-sail bg-ocean/10">
              <div className="absolute inset-y-0 left-0 rounded-sail bg-gradient-to-r from-lagoon to-coral w-[62%]" />
            </div>
            <div className="mt-2 text-xs text-ocean/60">62% of the way to destination!</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ocean py-20 text-sand-light">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">The Dhow Sail Model</p>
            <h2 className="mt-3 font-display text-3xl font-bold italic md:text-4xl text-sand">How Twende Malindi Works</h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-sail border border-sand/10 bg-ocean-dark p-8 transition hover:border-coral/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white font-mono text-lg font-bold">1</div>
              <h3 className="mt-6 font-display text-xl font-medium">Set Your Savings Goal</h3>
              <p className="mt-3 text-sm text-sand/70">
                Choose a destination package, select dates, and specify target amounts. Choose to pay in KES or USD.
              </p>
            </div>
            <div className="rounded-sail border border-sand/10 bg-ocean-dark p-8 transition hover:border-coral/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white font-mono text-lg font-bold">2</div>
              <h3 className="mt-6 font-display text-xl font-medium">Share the Invitation</h3>
              <p className="mt-3 text-sm text-sand/70">
                Copy your unique trip link. Anyone with the link can chip in using Paystack, card, or M-Pesa instantly. No signup required for contributors!
              </p>
            </div>
            <div className="rounded-sail border border-sand/10 bg-ocean-dark p-8 transition hover:border-coral/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lagoon text-white font-mono text-lg font-bold">3</div>
              <h3 className="mt-6 font-display text-xl font-medium">Set Sail to Malindi</h3>
              <p className="mt-3 text-sm text-sand/70">
                Unlock group commissions, match with vetted guides, and book premium beachfront partners automatically when the fund reaches maturity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vetted Local Guides */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-coral font-semibold">Local Experts</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ocean">Vetted Malindi Tour Guides</h2>
            </div>
            <Link href="/register" className="text-sm font-semibold text-coral hover:underline">
              Are you a local guide? Register now &rarr;
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_GUIDES.map((guide) => (
              <div key={guide.id} className="rounded-sail border border-ocean/10 bg-white p-5 hover:shadow-lg transition">
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
                      <span className="text-xs text-ocean/50">({guide.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-ocean/5 pt-4">
                  <span className="text-xs text-ocean/60">Tours from</span>
                  <span className="font-mono text-sm font-bold text-ocean">{formatMoney(guide.price)}/day</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beachfront Partners */}
      <section className="bg-sand/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-lagoon font-semibold">Vetted Accommodations</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ocean">Beachfront & Club Partners</h2>
            </div>
            <Link href="/partners" className="text-sm font-semibold text-ocean hover:underline">
              View all partners &rarr;
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {FEATURED_PARTNERS.map((partner) => (
              <div key={partner.name} className="flex flex-col overflow-hidden rounded-sail border border-ocean/10 bg-white sm:flex-row">
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
                    <p className="mt-3 text-xs italic text-ocean/70 leading-relaxed bg-sand-light/55 p-3 rounded-sail border border-ocean/5">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coastal Footer */}
      <footer className="border-t border-ocean/10 bg-ocean text-sand-light py-12">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-display text-3xl italic text-sand">Twende Malindi</h2>
          <p className="mt-2 text-xs text-sand/60">Tuko Tayari — Let's travel together.</p>
          <div className="mt-6 flex justify-center gap-6 text-xs text-sand/80">
            <Link href="/partners" className="hover:text-coral transition">Partners</Link>
            <Link href="/register" className="hover:text-coral transition">Register</Link>
            <Link href="/global" className="hover:text-coral transition">International</Link>
          </div>
          <p className="mt-8 text-[10px] text-sand/40">&copy; {new Date().getFullYear()} Twende Malindi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
