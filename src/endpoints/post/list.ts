import { OpenAPIRoute, type OpenAPIRouteSchema } from "chanfana";
import { getFirestore } from "firebase/firestore/lite";
import { z } from "zod";
import { getFirebaseApp } from "../../lib/firebase";
import { getPosts } from "../../lib/post";
import { type AppContext, postGroupSchema, postSchema } from "../../lib/types";

export class PostList extends OpenAPIRoute {
  readonly schema: OpenAPIRouteSchema = {
    tags: ["Posts"],
    summary: "List Posts",
    request: {
      query: z.object({
        group: postGroupSchema.optional(),
        limit: z.number().min(1).max(100).default(30),
        cursor: z.string().optional(),
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of posts",
        content: {
          "application/json": {
            schema: z.object({
              posts: postSchema.array(),
              nextCursor: z.string().nullable(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const request = await this.getValidatedData<typeof this.schema>();

    const firebase = getFirebaseApp(c);
    const firestore = getFirestore(firebase);

    const posts = await getPosts(firestore, {
      group: request.query.group,
      limit: request.query.limit + 1,
      cursor: request.query.cursor,
    });

    return {
      posts: posts.slice(0, request.query.limit),
      nextCursor:
        posts.length > request.query.limit
          ? posts[request.query.limit - 1].id
          : null,
    };
  }
}
