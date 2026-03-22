import {
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { defineMiddlewares } from "@medusajs/medusa";
import multer from "multer";
import { GetAdminReviewsSchema } from "./admin/reviews/route";
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route";
import { PostStoreReviewSchema } from "./store/products/[id]/reviews/route";
import { PostStoreProfessionalDesignRequestSchema } from "./store/professional-design-requests/validators";
import { GetAdminProDesignsRequestSchema } from "./admin/pro-designs-request/route";
import { PostAdminUpdateProDesignRequestStatusSchema } from "./admin/pro-designs-request/status/route";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

const upload = multer({ storage: multer.memoryStorage() });

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
        // authenticate("customer", ["session", "bearer"]),
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
      matcher: "/store/professional-design-requests",
      method: ["POST"],
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        validateAndTransformBody(PostStoreProfessionalDesignRequestSchema),
      ],
    },
    {
      matcher: "/admin/pro-designs-request",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetAdminProDesignsRequestSchema, {
          isList: true,
          defaults: [
            "id",
            "company_name",
            "industry",
            "description",
            "accent_colors",
            "style",
            "contact_name",
            "contact_email",
            "contact_phone",
            "customer_id",
            "status",
            "created_at",
            "updated_at",
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
    {
      matcher: "/admin/pro-designs-request/status",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(PostAdminUpdateProDesignRequestStatusSchema),
      ],
    },
    {
      matcher: "/store/uploads",
      method: ["POST"],
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        //@ts-ignore
        upload.array("files"),
      ],
    },
    {
      matcher: "/store/customizations",
      method: ["POST"],
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      matcher: "/admin/customizations*",
      method: ["GET", "POST"],
      middlewares: [
        validateAndTransformQuery(createFindParams(), {
          isList: true,
          defaults: [
            "id",
            "status",
            "image_url",
            "customer_id",
            "product_id",
            "created_at",
            "updated_at",
          ],
        }),
      ],
    },
  ],
});
