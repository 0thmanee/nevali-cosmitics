"use client";

import { authClient } from "~/lib/auth-client";

export { getCallbackUrlForRole } from "../constants";

export function useSession() {
  return authClient.useSession();
}
