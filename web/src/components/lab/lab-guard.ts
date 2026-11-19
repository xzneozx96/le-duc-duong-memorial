import { notFound } from "next/navigation";

/** Lab routes are dev-only: 404 in production unless LAB_ENABLED is set. */
export function labGuard() {
  if (process.env.NODE_ENV === "production" && !process.env.LAB_ENABLED) {
    notFound();
  }
}
