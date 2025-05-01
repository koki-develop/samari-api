import { fromHono } from "chanfana";
import { Hono } from "hono";
import { PostList } from "./endpoints/post/list";

const app = new Hono<{ Bindings: Env }>();

const openapi = fromHono(app, {
  docs_url: "/",
});

openapi.get("/v1/posts", PostList);

export default app;
