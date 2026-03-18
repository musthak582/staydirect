import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getHotel } from "@/actions/hotel-actions";
import { HotelProfileForm } from "@/components/dashboard/hotel/hotel-profile-form";
import { 
  GridBackground, 
  GlassCard,
  SectionHeader 
} from "@/components/ui/design-system";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Sparkles,
  ArrowRight, 
  Check
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HotelPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { hotel, error } = await getHotel();

  return (
    <div className="relative min-h-screen bg-white">
      <GridBackground />
      
      <div className="relative z-10 px-6 py-8 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs tracking-widest uppercase mb-8">
          <span className="text-zinc-400">Dashboard</span>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-900 font-medium">Hotel Profile</span>
          {hotel && (
            <>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-400">{hotel.name}</span>
            </>
          )}
        </div>

        {/* Header with preview button */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-zinc-600" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tighter text-zinc-900">
                  Hotel profile
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  Make your hotel stand out to potential guests
                </p>
              </div>
            </div>
          </div>

          {hotel?.slug && (
            <Link href={`/${hotel.slug}`} target="_blank">
              <Button 
                variant="outline" 
                className="border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 text-xs tracking-widest uppercase h-10 px-5 gap-2 group"
              >
                Preview live site
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          )}
        </div>

        {/* Progress steps */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  ${step === 1 
                    ? 'bg-zinc-900 text-white' 
                    : step < 1 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-zinc-100 text-zinc-400'
                  }
                `}>
                  {step < 1 ? <Check size={14} /> : step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-12 h-px mx-1
                    ${step < 1 ? 'bg-emerald-200' : 'bg-zinc-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-400 tracking-widest uppercase">
            Step 1 of 3: Hotel Information
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main form */}
          <div className="lg:col-span-2">
            <GlassCard>
              <HotelProfileForm initialData={hotel} />
            </GlassCard>
          </div>

          {/* Right column - Tips & Preview */}
          <div className="space-y-6">
            {/* Quick tips */}
            <GlassCard>
              <div className="p-5 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  <h3 className="text-sm font-semibold text-zinc-900">Pro tips</h3>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-5 h-5 bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-medium text-zinc-600">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-zinc-900 mb-1">{tip.title}</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Live preview card (if hotel exists) */}
            {hotel && (
              <GlassCard>
                <div className="p-5 border-b border-zinc-100">
                  <h3 className="text-sm font-semibold text-zinc-900">Current preview</h3>
                </div>
                <div className="p-5">
                  {/* Cover image preview */}
                  {hotel.coverImage ? (
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 border border-zinc-200">
                      <img 
                        src={hotel.coverImage} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-zinc-100 rounded-lg mb-4 flex items-center justify-center border border-zinc-200">
                      <Building2 size={24} className="text-zinc-300" />
                    </div>
                  )}

                  {/* Hotel info preview */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {hotel.logo ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200">
                          <img src={hotel.logo} alt={hotel.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                          <Building2 size={16} className="text-zinc-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{hotel.name || "Hotel name"}</p>
                        {hotel.location && (
                          <p className="text-xs text-zinc-500">{hotel.location}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact preview */}
                    <div className="space-y-2 pt-2">
                      {hotel.contactEmail && (
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Mail size={12} />
                          <span>{hotel.contactEmail}</span>
                        </div>
                      )}
                      {hotel.contactPhone && (
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Phone size={12} />
                          <span>{hotel.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Help card */}
            <GlassCard>
              <div className="p-5 text-center">
                <p className="text-xs text-zinc-400 mb-2">Need help?</p>
                <p className="text-xs text-zinc-600">
                  Check our <Link href="/help" className="text-zinc-900 underline underline-offset-2 hover:no-underline">guide</Link> or {' '}
                  <Link href="/support" className="text-zinc-900 underline underline-offset-2 hover:no-underline">contact support</Link>
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

const tips = [
  {
    title: "Choose a memorable slug",
    desc: "Your hotel URL will be staydirect.com/your-slug. Keep it short and easy to remember."
  },
  {
    title: "Add high-quality photos",
    desc: "Hotels with professional photos get 40% more bookings. Use bright, well-lit images."
  },
  {
    title: "Highlight your amenities",
    desc: "Free WiFi, breakfast, and parking are the top searched amenities. Make sure to list them."
  },
  {
    title: "Complete your profile",
    desc: "Hotels with complete profiles are 3x more likely to receive direct bookings."
  }
];