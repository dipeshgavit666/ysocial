import { SignIn } from "@clerk/react";

type ClerkAppearance = NonNullable<
  React.ComponentProps<typeof SignIn>["appearance"]
>;

export const clerkAppearance: ClerkAppearance = {
  variables: {
    colorPrimary: "var(--primary)",
    colorPrimaryForeground: "var(--primary-foreground)",
    colorBackground: "var(--card)",
    colorForeground: "var(--foreground)",
    colorMutedForeground: "var(--muted-foreground)",
    colorInput: "var(--background)",
    colorInputForeground: "var(--foreground)",
    colorNeutral: "var(--foreground)",
    fontFamily: "var(--font-manrope)",
    borderRadius: "var(--radius)",
  },
};
