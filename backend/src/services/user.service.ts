import { clerkClient } from "@clerk/express";
import { User, type IUser } from "../models/user.models";
import { ApiError } from "../utils/api-error";

const sanitizeUsername = (raw: string) =>
  raw
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .slice(0, 24);

/**
 * Returns the local MongoDB user for a Clerk user id, creating it the first
 * time that person hits the API. Clerk owns identity (email, name, avatar);
 * MongoDB only stores app data (bio, followers, ...) keyed by `clerkId`.
 */
export async function findOrCreateUser(clerkId: string): Promise<IUser> {
  const existing = await User.findOne({ clerkId });
  if (existing) return existing;

  const clerkUser = await clerkClient.users.getUser(clerkId);

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    ) ?? clerkUser.emailAddresses[0];
  if (!primaryEmail) {
    throw new ApiError(400, "Your account has no email address");
  }
  const email = primaryEmail.emailAddress;

  let username = sanitizeUsername(clerkUser.username ?? email.split("@")[0]!);
  if (username.length < 3) username = `user_${username}`;
  if (await User.exists({ username })) {
    username = `${username}_${clerkId.slice(-6).toLowerCase()}`;
  }

  // Upsert makes concurrent first requests (e.g. two tabs) safe.
  const user = await User.findOneAndUpdate(
    { clerkId },
    {
      $setOnInsert: {
        clerkId,
        email,
        username,
        firstName: clerkUser.firstName ?? "",
        lastName: clerkUser.lastName ?? "",
        profileImage: clerkUser.imageUrl ?? "",
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  return user;
}
