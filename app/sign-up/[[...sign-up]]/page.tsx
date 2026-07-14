import { SignUp } from '@clerk/nextjs';

/**
 * Sign-up route that renders Clerk's hosted sign-up UI centered on the page.
 */
export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
