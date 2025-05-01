import { OpenAPIRoute, type OpenAPIRouteSchema } from "chanfana";
import { z } from "zod";
import { type AppContext, postSchema } from "../../lib/types";
import { getFirebaseApp } from "../../lib/firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore/lite";

export class PostList extends OpenAPIRoute {
  readonly schema: OpenAPIRouteSchema = {
    tags: ["Posts"],
    summary: "List Posts",
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
    const firebase = getFirebaseApp(c);
    const firestore = getFirestore(firebase);

    const postsCollection = collection(firestore, "posts");
    const postsQuery = query(
      postsCollection,
      where("status", "==", "SUMMARIZED"),
      orderBy("timestamp", "desc"),
      limit(30),
    );
    const snapshot = await getDocs(postsQuery);

    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,

        group: data.group,
        source: data.source,

        title: data.title,
        url: data.url,
        datetime: data.timestamp.toDate(),

        headline: data.summarized_headline,
        summary: data.summarized_content,
      };
    });

    return { posts };
  }
}
