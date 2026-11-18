import { getDb } from "@/server/db/client";
import { makeHandlers } from "@/server/entries/handlers";
import { postLimiter } from "@/server/rate-limit";

const handlers = makeHandlers({ getDb, limiter: postLimiter });

export const POST = handlers.POST;
export const GET = handlers.GET;
