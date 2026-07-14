import { SignIn } from '@clerk/nextjs';

/**
 * Sign-in route that renders Clerk's hosted sign-in UI centered on the page.
 */
export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}
