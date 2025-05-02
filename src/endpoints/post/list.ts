import { OpenAPIRoute, type OpenAPIRouteSchema } from "chanfana";
import { getFirestore } from "firebase/firestore/lite";
import { z } from "zod";
import { getFirebaseApp } from "../../lib/firebase";
import { type AppContext, postSchema } from "../../lib/types";
import { getPosts } from "../../lib/post";

export class PostList extends OpenAPIRoute {
  readonly schema: OpenAPIRouteSchema = {
    tags: ["Posts"],
    summary: "List Posts",
    request: {
      query: z.object({
        limit: z.number().min(1).max(100).default(30),
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of posts",
        content: {
          "application/json": {
            schema: z.object({
              posts: postSchema.array(),
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
      limit: request.query.limit,
    });

    return { posts };
  }
}
