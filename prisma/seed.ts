// prisma/seed.ts
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs'

// const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@staydirect.io' },
    update: {},
    create: {
      name: 'Demo Owner',
      email: 'demo@staydirect.io',
      password: hashedPassword,
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create demo hotel
  const hotel = await prisma.hotel.upsert({
    where: { slug: 'villa-azure' },
    update: {},
    create: {
      name: 'Villa Azure',
      slug: 'villa-azure',
      description:
        'A stunning beachfront villa nestled on the shores of a pristine tropical bay. Experience unparalleled luxury with breathtaking ocean views, world-class amenities, and personalized service that makes every stay unforgettable.',
      location: 'Bali, Indonesia',
      address: 'Jl. Pantai Seminyak No. 88, Seminyak, Bali 80361',
      phone: '+62 361 888 0001',
      email: 'reservations@villa-azure.com',
      checkIn: '14:00',
      checkOut: '11:00',
      currency: 'USD',
      amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Gym', 'Beach Access', 'Concierge', 'Airport Transfer'],
      ownerId: user.id,
    },
  })

  console.log('✅ Created demo hotel:', hotel.name)

  // Create rooms
  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { id: 'room-001' },
      update: {},
      create: {
        id: 'room-001',
        hotelId: hotel.id,
        name: 'Deluxe Ocean View',
        description: 'Spacious room with panoramic ocean views, king-size bed, and private balcony overlooking the sea.',
        price: 185,
        capacity: 2,
        beds: 1,
        bathrooms: 1,
        size: 45,
        amenities: ['Ocean View', 'King Bed', 'Balcony', 'AC', 'WiFi', 'Mini-bar', 'Safe'],
        isAvailable: true,
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-002' },
      update: {},
      create: {
        id: 'room-002',
        hotelId: hotel.id,
        name: 'Garden Suite',
        description: 'Elegant suite surrounded by lush tropical gardens. Features a separate living area and soaking tub.',
        price: 265,
        capacity: 3,
        beds: 1,
        bathrooms: 2,
        size: 75,
        amenities: ['Garden View', 'King Bed', 'Soaking Tub', 'Living Room', 'AC', 'WiFi', 'Bathrobe'],
        isAvailable: true,
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-003' },
      update: {},
      create: {
        id: 'room-003',
        hotelId: hotel.id,
        name: 'Premium Villa Suite',
        description: 'Ultimate luxury with private plunge pool, butler service, and direct beach access. Ideal for honeymooners.',
        price: 520,
        capacity: 2,
        beds: 1,
        bathrooms: 2,
        size: 120,
        amenities: ['Private Pool', 'Beach Access', 'Butler Service', 'King Bed', 'Outdoor Shower', 'WiFi', 'Mini Kitchen'],
        isAvailable: true,
      },
    }),
    prisma.room.upsert({
      where: { id: 'room-004' },
      update: {},
      create: {
        id: 'room-004',
        hotelId: hotel.id,
        name: 'Family Bungalow',
        description: 'Spacious two-bedroom bungalow perfect for families. Features a shared living area and kitchenette.',
        price: 350,
        capacity: 4,
        beds: 2,
        bathrooms: 2,
        size: 95,
        amenities: ['2 Bedrooms', 'Living Room', 'Kitchenette', 'Kids Area', 'AC', 'WiFi', 'Pool Access'],
        isAvailable: true,
      },
    }),
  ])

  console.log(`✅ Created ${rooms.length} rooms`)

  // Create sample bookings
  const futureDate = (daysFromNow: number) => {
    const d = new Date()
    d.setDate(d.getDate() + daysFromNow)
    d.setHours(14, 0, 0, 0)
    return d
  }

  await Promise.all([
    prisma.booking.create({
      data: {
        hotelId: hotel.id,
        roomId: 'room-001',
        guestName: 'Sarah Johnson',
        guestEmail: 'sarah.j@example.com',
        guestPhone: '+1 555 012 3456',
        checkIn: futureDate(3),
        checkOut: futureDate(7),
        guests: 2,
        nights: 4,
        totalAmount: 740,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
      },
    }),
    prisma.booking.create({
      data: {
        hotelId: hotel.id,
        roomId: 'room-003',
        guestName: 'Marco & Elena Rossi',
        guestEmail: 'marco.rossi@example.com',
        guestPhone: '+39 02 1234567',
        checkIn: futureDate(10),
        checkOut: futureDate(17),
        guests: 2,
        nights: 7,
        totalAmount: 3640,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        guestMessage: 'Honeymoon trip, please prepare welcome amenities',
      },
    }),
    prisma.booking.create({
      data: {
        hotelId: hotel.id,
        roomId: 'room-002',
        guestName: 'Emma Wilson',
        guestEmail: 'emma.w@example.com',
        checkIn: futureDate(2),
        checkOut: futureDate(5),
        guests: 1,
        nights: 3,
        totalAmount: 795,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      },
    }),
    prisma.booking.create({
      data: {
        hotelId: hotel.id,
        roomId: 'room-004',
        guestName: 'The Anderson Family',
        guestEmail: 'j.anderson@example.com',
        guestPhone: '+44 20 7123 4567',
        checkIn: futureDate(20),
        checkOut: futureDate(27),
        guests: 4,
        nights: 7,
        totalAmount: 2450,
        status: 'CONFIRMED',
        paymentStatus: 'PENDING',
      },
    }),
  ])

  console.log('✅ Created sample bookings')

  // Create sample reviews
  await Promise.all([
    prisma.review.create({
      data: {
        hotelId: hotel.id,
        guestName: 'James T.',
        rating: 5,
        comment: 'Absolutely breathtaking! The villa exceeded every expectation. The staff was incredibly attentive and the ocean views from our room were unforgettable. Will definitely return.',
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        hotelId: hotel.id,
        guestName: 'Sophie L.',
        rating: 5,
        comment: 'Perfect honeymoon destination. The private pool villa was romantic beyond words. The butler service made us feel like royalty. The spa treatments were world-class.',
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        hotelId: hotel.id,
        guestName: 'David M.',
        rating: 4,
        comment: 'Wonderful stay overall. Beautiful property with stunning views. The restaurant food was exceptional. Only minor issue was slow WiFi, but everything else was perfect.',
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        hotelId: hotel.id,
        guestName: 'Priya K.',
        rating: 5,
        comment: 'We brought the whole family and everyone loved it! The family bungalow was perfect for us with plenty of space. The kids had a blast at the pool.',
        approved: true,
      },
    }),
  ])

  console.log('✅ Created sample reviews')
  console.log('')
  console.log('🎉 Seed complete!')
  console.log('📧 Demo login: demo@staydirect.io')
  console.log('🔑 Password: password123')
  console.log(`🌐 Demo hotel: http://localhost:3000/villa-azure`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
