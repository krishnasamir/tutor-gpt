'use client';
import { useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import Swal from 'sweetalert2';
import GoogleSignIn from './google';
import DiscordSignIn from './discord';

export default function SignIn(props: any) {
  const { stateSync, handler } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { theme } = useTheme();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsLoading(true);
    const formData = new FormData(formRef.current);
    try {
      const error = await handler(formData);
      if (error) {
        setError(true);
        Swal.fire({
          title: 'Error!',
          text: 'Incorrect Credentials',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#3085d6',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        action="#"
        ref={formRef}
        onSubmit={handleSignIn}
        className={`mt-8 space-y-6 text-foreground`}
      >
        <div>

          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className={`w-full border border-gray-400 text-gray-900 bg-white px-4 py-2 rounded text-base focus:outline-none focus:ring-2 focus:ring-[#174fa3]${error ? ' border-2 border-red-700' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>

          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className={`w-full border border-gray-400 text-gray-900 bg-white px-4 py-2 rounded text-base focus:outline-none focus:ring-2 focus:ring-[#174fa3]${error ? ' border-2 border-red-700' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button
            className={`w-full bg-[#174fa3] text-white font-medium py-2 rounded mt-2  text-base hover:bg-blue-900 transition`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'SIGN IN'
            )}
          </button>
        </div>

        <div className="flex justify-center items-center text-base mb-4">

            <p className="text-foreground2">
            Don&apos;t have an account?{' '}
            <a
              href="#"
              onClick={() => stateSync('SIGNUP')}
              className="ml-1 text-[#174fa3] font-semibold hover:text-blue-900"
            >
              Sign Up
            </a>
          </p>
        </div>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-400 text-sm font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
      </form>
      <div className="mt-6 space-y-4">
        <GoogleSignIn text="Sign In" />
        {/* <DiscordSignIn text="Sign In" /> */}

        <button
          className={`w-full border border-[#174fa3] text-[#174fa3] bg-white py-2 rounded mb-2 text-base font-medium hover:bg-[#f0f6fb] transition`}
        >
          <span className="mr-2"> {/* Optional: Clever logo here */} </span>
          Continue with Clever
        </button>

        <button
          className={`w-full border border-[#174fa3] text-[#174fa3] bg-white py-2 rounded mb-2 text-base font-medium hover:bg-[#f0f6fb] transition`}
        >
          <span className="mr-2"> {/* Optional: ClassLink logo here */} </span>
          Continue with ClassLink
        </button>
      </div>
    </>
  );
}
