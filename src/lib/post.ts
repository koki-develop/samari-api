import {
  type DocumentData,
  type DocumentSnapshot,
  type Firestore,
  type QueryConstraint,
  collection,
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore/lite";
import type { Post } from "./types";

export type GetPostsParameters = {
  limit: number;
  cursor?: string;
};

export async function getPosts(
  firestore: Firestore,
  params: GetPostsParameters,
): Promise<Post[]> {
  const postsCollection = collection(firestore, "posts");

  const constraints: QueryConstraint[] = [
    where("status", "==", "SUMMARIZED"),
    orderBy("timestamp", "desc"),
    limit(params.limit),
  ];

  if (params.cursor) {
    const cursorQuery = query(
      postsCollection,
      where(documentId(), "==", params.cursor),
    );
    await getDocs(cursorQuery)
      .then((snapshot) => {
        if (!snapshot.empty) {
          const cursorDoc = snapshot.docs[0];
          constraints.push(startAfter(cursorDoc));
        }
      })
      .catch((error) => {
        console.warn("Failed to get cursor doc", error);
      });
  }

  const postsQuery = query(postsCollection, ...constraints);
  const snapshot = await getDocs(postsQuery);

  const posts = snapshot.docs.map((doc) => _snapshotToPost(doc));

  return posts;
}

function _snapshotToPost(snapshot: DocumentSnapshot<DocumentData>): Post {
  const data = snapshot.data();
  return {
    id: snapshot.id,

    group: data.group,
    source: data.source,

    title: data.title,
    url: data.url,
    datetime: data.timestamp.toDate(),

    headline: data.summarized_headline,
    summary: data.summarized_content,
  };
}
