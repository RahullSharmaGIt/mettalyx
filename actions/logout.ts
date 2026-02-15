"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  await signOut();
};


// vendor:1 The resource http://localhost:3000/_next/static/chunks/%5Broot-of-the-server%5D__28bc9c2a._.css was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.