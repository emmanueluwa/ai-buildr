// app/providers.js
"use client";
import { env } from "@/env";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

interface CSPostHogProvider {
  children: React.ReactNode;
}
export function CSPostHogProvider({ children }: CSPostHogProvider) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
