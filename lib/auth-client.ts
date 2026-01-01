import { createAuthClient } from 'better-auth/react';
import { oneTapClient, magicLinkClient } from 'better-auth/client/plugins';

// Use current origin for local development, fall back to env variable for production
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  // Server-side: use env variable
  return process.env.NEXT_PUBLIC_BASE_URL;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    }),
    magicLinkClient(),
  ],
});
