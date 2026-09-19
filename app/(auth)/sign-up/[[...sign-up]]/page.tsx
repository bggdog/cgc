import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/university/clerk";

const appearance = {
  variables: {
    colorPrimary: "#1d4a3a",
    colorText: "#1e2420",
    borderRadius: "34px",
  },
} as const;

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="lau-auth-page">
        <div className="lau-auth-unavailable">
          <h1>Create account</h1>
          <p>
            Account creation is being connected. Check back soon, or return to
            the university home page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="lau-auth-page">
      <SignUp
        appearance={appearance}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/university"
      />
    </main>
  );
}
