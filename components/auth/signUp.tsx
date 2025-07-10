'use client';
import { useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import Swal from 'sweetalert2';
import GoogleSignIn from './google';
import DiscordSignIn from './discord';

export default function SignUp(props: {
  stateSync: (state: string) => void;
  handler: (formData: FormData) => Promise<any>;
}) {
  const { stateSync, handler } = props;
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [opt, setOpt] = useState<boolean>(true);
  const [age, setAge] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsLoading(true);
    try {
      const formData = new FormData(formRef.current);
      if (!age) {
        await Swal.fire({
          title: 'Age Verification Required',
          icon: 'error',
          text: 'Please confirm that you are 13 years or older',
          confirmButtonText: 'Close',
          confirmButtonColor: '#3085d6',
        });
        return;
      }
      if (password !== passwordConfirmation) {
        await Swal.fire({
          title: "Passwords don't match",
          icon: 'error',
          text: 'Re-confirm your password and try again',
          confirmButtonText: 'Close',
          confirmButtonColor: '#3085d6',
        });
        return;
      }
      if (password.length < 6) {
        await Swal.fire({
          title: 'Insufficient Password',
          icon: 'error',
          text: 'Make sure the password is at least 6 characters long',
          confirmButtonText: 'Close',
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      const error = await handler(formData);
      if (error) {
        Swal.fire({
          title: 'Something went wrong',
          icon: 'error',
          text: 'Please try again and make sure the password is at least 6 characters long',
          confirmButtonText: 'Close',
          confirmButtonColor: '#3085d6',
        });
        console.error(error);
      } else {
        Swal.fire({
          title: 'Success',
          icon: 'success',
          text: 'Please check your email for a verification link',
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
        onSubmit={handleSignUp}
        className={`mt-8 space-y-6 text-foreground`}
      >
        <div>

          <input
            type="email"
            id="Email"
            name="email"
            placeholder="Email"
            className={`w-full border border-gray-400 text-gray-900 bg-white px-4 py-2 rounded text-base focus:outline-none focus:ring-2 focus:ring-[#174fa3]`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">

            <input
              type="password"
              id="Password"
              name="password"
              placeholder="Password"
              className={`w-full border border-gray-400 text-gray-900 bg-white px-4 py-2 rounded text-base focus:outline-none focus:ring-2 focus:ring-[#174fa3]`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex-1">

            <input
              type="password"
              id="PasswordConfirmation"
              name="password_confirmation"
              placeholder="Password Confirmation"
              className={`w-full border border-gray-400 text-gray-900 bg-white px-4 py-2 rounded text-base focus:outline-none focus:ring-2 focus:ring-[#174fa3]`}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="MarketingAccept" className="flex gap-4">
            <input
              type="checkbox"
              id="MarketingAccept"
              name="marketing_accept"
              className={`h-5 w-5 rounded-md shadow-xs bg-accent`}
              checked={opt}
              onChange={(e) => setOpt(!opt)}
            />

            <span className={`text-sm text-foreground`}>
              I want to receive emails about events, product updates and company
              announcements.
            </span>
          </label>
        </div>

        <div>
          <label htmlFor="AgeAccept" className="flex gap-4">
            <input
              type="checkbox"
              id="AgeAccept"
              name="age_accept"
              className={`h-5 w-5 rounded-md shadow-xs bg-accent`}
              checked={age}
              onChange={(e) => setAge(!age)}
              required
            />

            <span className={`text-sm text-foreground`}>
              I am confirming that I am at least 13 years old.
            </span>
          </label>
        </div>

        <div>
          <p className={`text-sm text-foreground`}>
            By creating an account, you agree to our{' '}
            <a
              href="https://app.termly.io/document/terms-of-service/ba5ac452-fdd6-4746-8b31-973351d05008"
              target="_blank"
              className="ml-1 text-[#174fa3] font-semibold hover:text-blue-900"
              rel="noreferrer"
            >
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a
              href="https://app.termly.io/document/privacy-policy/29672110-b634-40ae-854d-ebaf55e8fa75"
              target="_blank"
              className="ml-1 text-[#174fa3] font-semibold hover:text-blue-900"
              rel="noreferrer"
            >
              Privacy Policy
            </a>
            .
          </p>
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
              'Create an account'
            )}
          </button>
        </div>

        <div className="flex justify-center items-center text-base mb-4">
          <p
          >
            Already have an account?{' '}
            <a
              href="#"
              onClick={() => stateSync('LOGIN')}
              className="ml-1 text-[#174fa3] font-semibold hover:text-blue-900"
            >
              Log in
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
        <GoogleSignIn text="Sign Up" />
        {/* <DiscordSignIn text="Sign Up" /> */}
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
