import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email"; // we'll create this next

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL, // required for Google callback URL

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // blocks login until email is verified

    // Fires when someone tries to register with an already-registered email
    // Returns 200 either way to prevent user enumeration (OWASP best practice)
    onExistingUserSignUp: async ({ user }) => {
      void sendEmail({
        to: user.email,
        subject: "You already have an account",
        text: `Someone tried to sign up with your email address.

               You already have an Axiom account. If this was you, just sign in:
               https://yourdomain.com/sign-in

               If you forgot your password:
               https://yourdomain.com/forgot-password

              If this wasn't you, you can safely ignore this email.`,
      });
    },

    sendResetPassword: async ({ user, url }) => {
      void sendEmail({ // no await = prevents timing attacks
        to: user.email,
        subject: "Reset your password",
        text: `Click to reset your password: ${url}`,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({ // no await = prevents timing attacks
        to: user.email,
        subject: "Verify your email address",
        text: `Click to verify your email: ${url}`,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      prompt: "select_account", // always show account chooser
    },
  },
});