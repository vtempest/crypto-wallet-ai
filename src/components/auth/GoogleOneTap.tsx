'use client';

import { authClient } from '@/lib/auth-client';
import { useSession } from '@/lib/hooks/useSession';
import { useEffect, useRef } from 'react';

export default function GoogleOneTap() {
  const { isAuthenticated, isLoading } = useSession();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only show One Tap if user is not authenticated and not loading
    if (!isAuthenticated && !isLoading && !hasInitialized.current) {
      hasInitialized.current = true;

      // Initialize Google One Tap
      authClient.oneTap({
        fetchOptions: {
          onSuccess: () => {
            // Reload page to update session
            window.location.reload();
          },
          onError: (ctx) => {
            console.error('One Tap error:', ctx.error);
          },
        },
      });
    }
  }, [isAuthenticated, isLoading]);

  // One Tap is rendered by the Google SDK, not React
  return null;
}
