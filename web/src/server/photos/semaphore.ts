import "server-only";

/** Lets at most `limit` tasks run at once; the others wait their turn in order. */
export function createSemaphore(limit: number) {
  let active = 0;
  const waiting: (() => void)[] = [];
  return {
    async run<T>(task: () => Promise<T>): Promise<T> {
      if (active >= limit) await new Promise<void>((resolve) => waiting.push(resolve));
      else active++;
      try {
        return await task();
      } finally {
        const next = waiting.shift();
        if (next) next(); // hand the slot over without releasing it
        else active--;
      }
    },
  };
}
