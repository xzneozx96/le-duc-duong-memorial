import "server-only";
import { getDb } from "@/server/db/client";
import { createPhotoLimiter, makeHandlers } from "./handlers";
import { getPhotoStore } from "./store";

/** The app's photo handlers: 300 uploads per client per hour, database and store built on first use. */
export const photoHandlers = makeHandlers({
  getDb,
  getStore: getPhotoStore,
  limiter: createPhotoLimiter(),
});
