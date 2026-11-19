import "server-only";
import { and, inArray, isNull } from "drizzle-orm";
import type { Db } from "@/server/db/client";
import { photos } from "@/server/db/schema";

/**
 * Remembers which staged photos each client uploaded, so one client cannot park more than
 * `max` unattached photos. In memory, so per process. Entries leave the map by themselves:
 * each check asks the database which of the client's photos are still staged, which drops
 * photos that were attached to a post or swept after expiry.
 */
export function createPendingTracker(max: number) {
  const byClient = new Map<string, Set<string>>();
  return {
    async isFull(db: Db, key: string): Promise<boolean> {
      const ids = byClient.get(key);
      if (!ids) return false;
      const still = await db
        .select({ id: photos.id })
        .from(photos)
        .where(and(inArray(photos.id, [...ids]), isNull(photos.entryId)));
      if (still.length === 0) {
        byClient.delete(key);
        return false;
      }
      byClient.set(key, new Set(still.map((r) => r.id)));
      return still.length >= max;
    },
    add(key: string, id: string) {
      const ids = byClient.get(key) ?? new Set<string>();
      ids.add(id);
      byClient.set(key, ids);
    },
  };
}
