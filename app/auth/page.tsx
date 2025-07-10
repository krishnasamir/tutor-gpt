'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
// import { useTheme } from 'next-themes';

import { SignIn, SignUp, Forgot } from '@/components/auth';

import { login, signup } from './actions';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [formType, setFormType] = useState('LOGIN');
  const supabase = createClient();
  // const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Can't access this page if you're logged in
        router.push('/');
      }
    });
  }, [supabase]);

  return (
    <section
      className="h-[calc(100vh-72px)] w-full bg-background"
      suppressHydrationWarning={true}
    >
      <div className="flex flex-col lg:flex-row h-full w-full">
        <div className="absolute top-8 left-8">
          <a className="block text-blue-600" href="/">
            <span className="sr-only">Home</span>
            <Image
              src="/bloomicon.jpg"
              alt="banner"
              width={40}
              height={40}
              className="h-10 sm:h-10 w-auto rounded-full"
            />
          </a>
        </div>
        <main
          className={`flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-background'
          }`}
        >
          <div className="mx-auto w-full max-w-md rounded-lg p-8">
            <h1
              className={`mt-6 text-2xl font-bold text-center sm:text-3xl md:text-4xl text-foreground1`}
            >
              Welcome !
            </h1>

            <div suppressHydrationWarning>
              {formType === 'LOGIN' && (
                <SignIn stateSync={setFormType} handler={login} />
              )}
              {formType === 'SIGNUP' && (
                <SignUp stateSync={setFormType} handler={signup} />
              )}
              {formType === 'FORGOT' && <Forgot stateSync={setFormType} />}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
