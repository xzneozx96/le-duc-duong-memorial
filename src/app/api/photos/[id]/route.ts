import { photoHandlers } from "@/server/photos/wiring";

export async function GET(req: Request, ctx: RouteContext<"/api/photos/[id]">) {
  const { id } = await ctx.params;
  return photoHandlers.GET(req, id);
}
