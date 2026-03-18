"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const hotelSchema = z.object({
  name: z.string().min(2, "Hotel name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  location: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  logo: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal("")),
  amenities: z.array(z.string()).default([]),
});

export async function getHotel() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const hotel = await prisma.hotel.findUnique({
      where: { ownerId: session.user.id },
    });

    return { hotel };
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return { error: "Failed to fetch hotel" };
  }
}

// Used by dashboard pages that need the hotel plus relations (rooms, etc.)
export async function getMyHotel() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) return null;

  return prisma.hotel.findUnique({
    where: { ownerId: session.user.id },
    include: { rooms: true },
  });
}

export async function createOrUpdateHotel(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Parse form data
    const rawData = {
      name: (formData.get("name") as string) ?? "",
      slug: (formData.get("slug") as string) ?? "",
      description: (formData.get("description") as string) ?? "",
      location: (formData.get("location") as string) ?? "",
      contactEmail: (formData.get("contactEmail") as string) ?? "",
      contactPhone: (formData.get("contactPhone") as string) ?? "",
      logo: (formData.get("logo") as string) ?? "",
      coverImage: (formData.get("coverImage") as string) ?? "",
      amenities: formData.getAll("amenities").map(String),
    };

    // Validate
    const validated = hotelSchema.parse(rawData);

    // Check if slug is unique (excluding current hotel)
    const existingHotel = await prisma.hotel.findFirst({
      where: {
        slug: validated.slug,
        NOT: {
          ownerId: session.user.id,
        },
      },
    });

    if (existingHotel) {
      return { error: "This slug is already taken. Please choose another." };
    }

    // Upsert hotel
    const hotel = await prisma.hotel.upsert({
      where: {
        ownerId: session.user.id,
      },
      update: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        location: validated.location,
        contactEmail: validated.contactEmail,
        contactPhone: validated.contactPhone,
        logo: validated.logo || null,
        coverImage: validated.coverImage || null,
        amenities: validated.amenities.length ? validated.amenities : [],
      },
      create: {
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        location: validated.location,
        contactEmail: validated.contactEmail,
        contactPhone: validated.contactPhone,
        logo: validated.logo || null,
        coverImage: validated.coverImage || null,
        amenities: validated.amenities.length ? validated.amenities : [],
        ownerId: session.user.id,
      },
    });

    revalidatePath("/dashboard/hotel");
    return { hotel, success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Invalid input" };
    }

    console.error("Error saving hotel:", error);
    return { error: "Failed to save hotel" };
  }
}