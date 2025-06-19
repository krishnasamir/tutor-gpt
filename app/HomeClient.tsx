'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Chat from './Chat';
import { CookieConsentBanner } from '@/components/cookieConsentBanner';

export default function HomeClient() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) {
    // Optionally redirect, or show login link
    window.location.href = '/auth';
    return null;
  }

  return (
    <>
      <CookieConsentBanner />
      <Chat initialUserId={user.id} initialEmail={user.email} />
    </>
  );
}
