export const DB_NAME = "ysocial";
export const POST_TTL_MS = 24 * 60 * 60 * 1000;
export const PUBLIC_USER_FIELDS = "username firstName lastName profileImage";
export const notExpired = () => ({
  $or: [{ expiredAt: null }, { expiredAt: { $gt: new Date() } }],
});
