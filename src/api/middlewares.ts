import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { defineMiddlewares } from "@medusajs/medusa";
import { GetAdminReviewsSchema } from "./admin/reviews/route";
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/customers/me",
      middlewares: [
        (req, res, next) => {
          (req.allowed ??= []).push("designer");
          next();
        },
      ],
    },
    {
      matcher: "/admin/reviews",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetAdminReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "content",
            "rating",
            "product_id",
            "customer_id",
            "status",
            "created_at",
            "updated_at",
            "product.*",
          ],
        }),
      ],
    },
    {
      matcher: "/admin/reviews/status",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(PostAdminUpdateReviewsStatusSchema),
      ],
    },
  ],
});
