const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const nodeEnv = process.env.NODE_ENV ?? "development";

export const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: nodeEnv,
  IS_PROD: nodeEnv === "production",

  MONGO_URI:
    nodeEnv === "production"
      ? required("MONGO_URI")
      : (process.env.MONGO_URI ?? "mongodb://localhost:27017"),

  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),

  CLERK_PUBLISHABLE_KEY: required("CLERK_PUBLISHABLE_KEY"),
  CLERK_SECRET_KEY: required("CLERK_SECRET_KEY"),

  // Optional: only needed for image uploads.
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
