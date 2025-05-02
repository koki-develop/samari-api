import {
  type Firestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore/lite";
import type { Post } from "./types";

export type GetPostsParameters = {
  limit: number;
};

export async function getPosts(
  firestore: Firestore,
  params: GetPostsParameters,
): Promise<Post[]> {
  const postsCollection = collection(firestore, "posts");
  const postsQuery = query(
    postsCollection,
    where("status", "==", "SUMMARIZED"),
    orderBy("timestamp", "desc"),
    limit(params.limit),
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

  return posts;
}
