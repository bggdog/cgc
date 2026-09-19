"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

/** Header account controls for `UniversityHeader` authSlot. */
export function UniversityAuthControls() {
  return (
    <div className="lau-auth" data-testid="auth">
      <SignedOut>
        <SignInButton mode="redirect">
          <button type="button" className="lau-auth-signin">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "lau-auth-avatar",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
