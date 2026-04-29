import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL || "",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key",
  trustHost: true,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: true, // Allow modification during registration
      },
      username: {
        type: "string",
        required: false,
      },
      shopName: {
        type: "string",
        required: false,
      },
      payoutMethod: {
        type: "string",
        required: false,
      },
      phoneNumber: {
        type: "string",
        required: false,
      },
      onboarded: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      location: {
        type: "string",
        required: false,
      },
      instagram: {
        type: "string",
        required: false,
      },
      facebook: {
        type: "string",
        required: false,
      },
      tiktok: {
        type: "string",
        required: false,
      },
      payoutDetails: {
        type: "string",
        required: false,
      },
    },
  },
});
