import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/university/clerk";

const appearance = {
  variables: {
    colorPrimary: "#1d4a3a",
    colorText: "#1e2420",
    borderRadius: "34px",
  },
} as const;

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="lau-auth-page">
        <div className="lau-auth-unavailable">
          <h1>Sign in</h1>
          <p>
            Sign-in is being connected. Check back soon, or return to the
            university home page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="lau-auth-page">
      <SignIn
        appearance={appearance}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/university"
      />
    </main>
  );
}
