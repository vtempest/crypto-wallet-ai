import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { oneTap, openAPI, magicLink } from "better-auth/plugins";
import * as schema from './db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
    },
    microsoft: {
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
    },
    facebook: {
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    },
    linkedin: {
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
    },
  },


  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
  },
  plugins: [
    oneTap(),
    openAPI(),
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        // Development: Log magic link to console
        // TODO: Replace with real email provider (Resend, Nodemailer, etc.)
        console.log('='.repeat(60));
        console.log('🔗 Magic Link Sign-In');
        console.log('='.repeat(60));
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Token: ${token}`);
        console.log(`🌐 Magic Link URL:\n${url}`);
        console.log('='.repeat(60));
      },
      expiresIn: 300, // 5 minutes
      disableSignUp: false, // Allow new users to sign up via magic link
    }),
  ],
});
