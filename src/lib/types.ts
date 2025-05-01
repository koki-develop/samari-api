import { z } from "zod";

export const postGroupSchema = z.enum([
  // Development
  "Bitbucket",
  "CircleCI",
  "GitHub",
  "GitLab",
  // Cloud/Infrastucture
  "AWS",
  "Azure",
  "Firebase",
  "Google Cloud",
  "Kubernetes",
  "Terraform",
  // Libraries/Frameworks
  "Angular",
  "Django",
  "Next.js",
  "Nuxt",
  "Rails",
  "React",
  "Vue.js",
  // Programming
  "Go",
  "Kotlin",
  "Node.js",
  "Python",
  "Ruby",
  "Rust",
  "Swift",
  "TypeScript",
]);

export type PostGroup = z.infer<typeof postGroupSchema>;

export const postSchema = z.object({
  group: postGroupSchema,
  source: z.string(),

  title: z.string(),
  url: z.string(),
  datetime: z.date(),

  headline: z.string(),
  summary: z.string(),
});

export type Post = z.infer<typeof postSchema>;
