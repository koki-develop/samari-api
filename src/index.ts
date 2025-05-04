import { fromHono } from "chanfana";
import { Hono } from "hono";
import { version } from "../package.json";
import { PostList } from "./endpoints/post/list";

const app = new Hono<{ Bindings: Env }>();

app.use(async (c, next) => {
  const { success } = await c.env.RATE_LIMITER.limit({
    key: c.req.header("x-forwarded-for") ?? "",
  });
  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
  }
  return next();
});

const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "SAMARI API",
      version,
      description: "API for [SAMARI](https://samari.news).",
    },
  },
});

openapi.get("/v0/posts", PostList);

export default app;
