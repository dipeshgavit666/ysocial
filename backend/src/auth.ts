import { createClerkClient } from "@clerk/backend";
import { ENV } from "./config/env";
export const clerk = createClerkClient({
  secretKey: ENV.CLERK_SECRET_KEY,
  publishableKey: ENV.CLERK_PUBLISHABLE_KEY,
});
// returns the clerk user ID, or null if the request is not signed in.
export async function getUserId(req: Request): Promise<string | null> {
  const state = await clerk.authenticateRequest(req, {
    authorizedParties: [ENV.CORS_ORIGIN!],
  });
  if (!state.isAuthenticated) return null;
  return state.toAuth().userId;
}
