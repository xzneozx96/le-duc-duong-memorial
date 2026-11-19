/** Class names for a direction's plain stylesheet: s.page -> "<prefix>-page". */
export const classes = (prefix: string) =>
  new Proxy({} as Record<string, string>, { get: (_, k) => `${prefix}-${String(k)}` });
