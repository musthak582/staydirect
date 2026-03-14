// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient(); // ✅ add this

export const { signIn, signUp, signOut, useSession, sendVerificationEmail } =
  authClient; // ✅ destructure from it