import Link from "next/link";

const PARTNERS = [
  {
    name: "Driftwood Beach Club",
    type: "Hotel & Dining",
    location: "Silversands Road, Malindi",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400",
    description: "Famous for beachfront dining, sea breeze, and cozy cottages. Offers comfortable retreats directly facing the Indian Ocean.",
    partnership: "Partnered since August 2024. We receive a 10% commission on room bookings and 8% on curated dining events booked by our groups.",
  },
  {
    name: "Temple Point Resort",
    type: "Resort & Spa",
    location: "Marine Park Road, Watamu/Malindi",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400",
    description: "Nestled at the corner of Mida Creek, Temple Point offers pristine water views, spa facilities, and guided mangrove tours.",
    partnership: "Partnered since October 2024. We receive a 12% commission on confirmed standard stays and 15% on spa/excursion packages.",
  },
  {
    name: "Woburn Residence Club",
    type: "Boutique Apartments",
    location: "Lamu Road, Malindi",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    description: "Sophisticated boutique suites with lush tropical gardens, two tier swimming pools, and quiet executive styling.",
    partnership: "Partnered since December 2024. Woburn offers a flat 10% commission on bookings over 3 nights, split back into vacation cash rewards.",
  },
  {
    name: "Baraza Beach Club",
    type: "Lounge & Nightlife",
    location: "Silversands Beach, Malindi",
    image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=400",
    description: "Premium coastal sunset lounge and evening dancing, featuring oceanfront views and local Swahili tapas menu.",
    partnership: "Partnered since January 2025. Group VIP table bookings receive 15% discount, with a 10% cash commission paid to the travel group's fund.",
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-sand-light text-ink">
      {/* Header */}
      <header className="border-b border-ocean/10 bg-sand-light/85 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-semibold italic text-ocean">
            Twende Malindi
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-ocean hover:text-coral transition">
              Home
            </Link>
            <Link href="/register" className="rounded-full bg-coral px-4 py-2 text-xs font-semibold text-white transition hover:bg-coral/90">
              Apply as Partner
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-coral font-semibold">Our Ecosystem</p>
        <h1 className="mt-2 font-display text-4xl font-bold italic text-ocean md:text-5xl">Vetted Partners Directory</h1>
        <p className="mt-4 text-base text-ocean/80 max-w-xl mx-auto">
          We collaborate with the best boutique hotels, Airbnbs, and beach clubs in Malindi. We believe in total transparency: each partner arrangement is clearly detailed below.
        </p>
      </section>

      {/* Directory Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col overflow-hidden rounded-sail border border-ocean/10 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-56 w-full">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-ocean px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sand-light">
                  {partner.type}
                </span>
              </div>
              <div className="flex flex-col justify-between flex-1 p-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-ocean">{partner.name}</h3>
                  <p className="text-xs text-ocean/50 font-medium mt-1">📍 {partner.location}</p>
                  <p className="mt-4 text-sm text-ocean/70 leading-relaxed">{partner.description}</p>
                </div>
                
                {/* Transparency Partnership block */}
                <div className="mt-6 border-t border-ocean/10 pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-coral font-bold block mb-1.5">
                    Our Partnership Agreement
                  </span>
                  <p className="text-xs italic text-ocean/80 leading-relaxed bg-sand/20 p-3 rounded-sail border border-ocean/5">
                    {partner.partnership}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic application prompt card */}
        <div className="mt-16 rounded-sail bg-ocean p-8 text-center text-sand-light md:p-12">
          <h2 className="font-display text-3xl font-bold italic">List your business on Twende Malindi</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-sand/80">
            Reach groups actively pooling vacation funds. Apply today, pay the one-time registration fee, and let’s direct verified travelers straight to your doors.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-block rounded-full bg-coral px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-coral/90 hover:scale-[1.02]"
            >
              Apply as Business Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ocean/10 bg-ocean text-sand-light py-10">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-sand/50">
          <p>Twende Malindi — transparent tourism ecosystem.</p>
          <p className="mt-4">&copy; {new Date().getFullYear()} Twende Malindi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
