import {
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { defineMiddlewares } from "@medusajs/medusa";
import { GetAdminReviewsSchema } from "./admin/reviews/route";
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route";
import { PostStoreReviewSchema } from "./store/products/[id]/reviews/route";

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
      method: ["POST"],
      matcher: "/store/products/:id/reviews",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        validateAndTransformBody(PostStoreReviewSchema),
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
            "customer.*",
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
