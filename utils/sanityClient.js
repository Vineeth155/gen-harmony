import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Sanity project ID
  dataset: "production", // Sanity dataset (usually 'production')
  apiVersion: "2024-12-28", // The current date in yyyy-mm-dd format
  token: process.env.NEXT_PUBLIC_SANITY_AUDIO_TOKEN, // Optional: for authenticated requests
  ignoreBrowserTokenWarning: true,
  useCdn: true, // Use the CDN for faster reads, turn off for real-time updates
});
