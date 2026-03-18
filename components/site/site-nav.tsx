import Link from "next/link";

type Props = { hotelName: string; hotelSlug: string };

export function SiteNav({ hotelName, hotelSlug }: Props) {
  return (
    <nav className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-zinc-200 flex items-center justify-between px-8 py-4 sticky top-0">
      <Link href={`/${hotelSlug}`} className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-zinc-950 rounded-md flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-white rounded-sm" />
        </div>
        <span className="text-xs font-medium tracking-widest uppercase text-zinc-900">{hotelName}</span>
      </Link>
      <div className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase text-zinc-400">
        <Link href={`/${hotelSlug}#rooms`} className="hover:text-zinc-900 transition-colors">Rooms</Link>
        <Link href={`/${hotelSlug}#contact`} className="hover:text-zinc-900 transition-colors">Contact</Link>
      </div>
      <Link href={`/${hotelSlug}/book`}>
        <button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-9 px-5 rounded-lg transition-colors">
          Book now
        </button>
      </Link>
    </nav>
  );
}