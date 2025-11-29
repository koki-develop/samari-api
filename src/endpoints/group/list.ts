import { OpenAPIRoute, type OpenAPIRouteSchema } from "chanfana";
import { z } from "zod";
import { type AppContext, postGroupSchema } from "../../lib/types";

export class GroupList extends OpenAPIRoute {
  readonly schema: OpenAPIRouteSchema = {
    tags: ["Groups"],
    summary: "List Groups",
    responses: {
      "200": {
        description: "Returns a list of groups",
        content: {
          "application/json": {
            schema: z.array(postGroupSchema),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    return c.json(Object.values(postGroupSchema.Values));
  }
}
