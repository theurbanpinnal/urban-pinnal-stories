import { createClient } from "@sanity/client";

// Sanity credentials are provided via Vite env vars (add them to your .env file):
// VITE_SANITY_PROJECT_ID=<projectId>
// VITE_SANITY_DATASET=<dataset>
// VITE_SANITY_API_VERSION=2023-10-15 (optional override)

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID as string,
  dataset: import.meta.env.VITE_SANITY_DATASET as string,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2023-10-15",
  useCdn: import.meta.env.PROD, // Use CDN in production, fresh data in development
});

export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  readTime: number; // minutes
  coverUrl?: string;
  coverAlt?: string;
  body?: any;
}

export const fetchPosts = async (): Promise<SanityPost[]> => {
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc){
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      readTime,
      "coverUrl": coverImage.asset->url,
      "coverAlt": coverImage.alt
    }`
  );
};

export const fetchPostBySlug = async (slug: string): Promise<SanityPost> => {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      publishedAt,
      readTime,
      body,
      "coverUrl": coverImage.asset->url,
      "coverAlt": coverImage.alt
    }`,
    { slug }
  );
};
