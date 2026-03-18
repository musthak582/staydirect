import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Fetch hotel data for the live site link
  const hotel = await prisma.hotel.findUnique({
    where: { ownerId: session.user.id },
    select: { slug: true, name: true },
  });

  return (
    <div className="relative min-h-screen bg-white">
      <DashboardSidebar 
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
        hotelSlug={hotel?.slug}
        hotelName={hotel?.name}
      />
      <main className="lg:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}