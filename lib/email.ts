import nodemailer from "nodemailer";
import type { Booking, Room, Hotel } from "@/app/generated/prisma/client";
import { formatDate, formatPrice, calculateNights } from "@/lib/utils";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password, NOT your Gmail password
  },
});

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  await transporter.sendMail({
    from: `"Axiom" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}


// import your existing nodemailer transporter here

type BookingEmailPayload = {
  booking: Booking;
  room: Room;
  hotel: Hotel;
};

export async function sendBookingConfirmation({ booking, room, hotel }: BookingEmailPayload) {
  const nights = calculateNights(booking.checkIn, booking.checkOut);

  await transporter.sendMail({
    from: `"${hotel.name}" <${process.env.EMAIL_USER}>`,
    to: booking.guestEmail,
    subject: `Booking ${booking.status === "PENDING" ? "Received" : "Confirmed"} — ${hotel.name}`,
    html: `
      <div style="font-family:monospace;max-width:560px;margin:0 auto;padding:32px;background:#fff;border:1px solid #e4e4e7">
        <h2 style="font-size:18px;font-weight:600;margin-bottom:8px">${hotel.name}</h2>
        <p style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:24px">Booking confirmation</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <tr><td style="padding:8px 0;color:#71717a;border-bottom:1px solid #f4f4f5">Room</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right">${room.name}</td></tr>
          <tr><td style="padding:8px 0;color:#71717a;border-bottom:1px solid #f4f4f5">Check-in</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right">${formatDate(booking.checkIn)}</td></tr>
          <tr><td style="padding:8px 0;color:#71717a;border-bottom:1px solid #f4f4f5">Check-out</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right">${formatDate(booking.checkOut)}</td></tr>
          <tr><td style="padding:8px 0;color:#71717a;border-bottom:1px solid #f4f4f5">Nights</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right">${nights}</td></tr>
          <tr><td style="padding:8px 0;color:#71717a;border-bottom:1px solid #f4f4f5">Guests</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right">${booking.guests}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Total</td><td style="padding:8px 0;font-weight:600;text-align:right">${formatPrice(booking.totalPrice)}</td></tr>
        </table>
        <p style="margin-top:24px;font-size:12px;color:#71717a">Status: <span style="color:#18181b;font-weight:600">${booking.status}</span></p>
      </div>
    `,
  });
}

export async function sendBookingNotification({ booking, room, hotel }: BookingEmailPayload) {
  await transporter.sendMail({
    from: `"StayDirect" <${process.env.EMAIL_USER}>`,
    to: hotel.contactEmail!,
    subject: `New booking request — ${room.name}`,
    html: `
      <div style="font-family:monospace;max-width:560px;margin:0 auto;padding:32px;background:#fff;border:1px solid #e4e4e7">
        <h2 style="font-size:18px;font-weight:600;margin-bottom:8px">New booking request</h2>
        <p style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:24px">${hotel.name}</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <tr><td style="padding:8px 0;color:#71717a;border-bottom:1px solid #f4f4f5">Guest</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right">${booking.guestName}</td></tr>
          <tr><td style="padding:8px 0;color:#71717a;border-bottom:1px solid #f4f4f5">Email</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right">${booking.guestEmail}</td></tr>
          <tr><td style="padding:8px 0;color:#71717a;border-bottom:1px solid #f4f4f5">Room</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right">${room.name}</td></tr>
          <tr><td style="padding:8px 0;color:#71717a;border-bottom:1px solid #f4f4f5">Check-in</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right">${formatDate(booking.checkIn)}</td></tr>
          <tr><td style="padding:8px 0;color:#71717a;border-bottom:1px solid #f4f4f5">Check-out</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5;text-align:right">${formatDate(booking.checkOut)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Total</td><td style="padding:8px 0;font-weight:600;text-align:right">${formatPrice(booking.totalPrice)}</td></tr>
        </table>
        <p style="margin-top:24px;font-size:12px;color:#71717a">Log in to your dashboard to confirm or cancel this booking.</p>
      </div>
    `,
  });
}