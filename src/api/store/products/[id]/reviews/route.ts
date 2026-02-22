import {
  MedusaRequest,
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { REVIEWS_MODULE } from "../../../../../modules/reviews";
import ReviewService from "../../../../../modules/reviews/service";
import { z } from "@medusajs/framework/zod";
import { createReviewWorkflow } from "../../../../../workflows/review/create-review-workflow";

export const PostStoreReviewSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  rating: z.preprocess((val) => {
    if (val && typeof val === "string") {
      return parseInt(val);
    }
    return val;
  }, z.number().min(1).max(5)),
  first_name: z.string(),
  last_name: z.string(),
});

type PostStoreReviewReq = z.infer<typeof PostStoreReviewSchema>;

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const reviewService: ReviewService = req.scope.resolve(REVIEWS_MODULE);

  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
  const offset = parseInt(req.query.offset as string) || 0;

  const reviews = await reviewService.listReviews(
    {
      product_id: id,
      status: "approved",
    },
    {
      take: limit,
      skip: offset,
      order: { created_at: "DESC" },
    },
  );

  const data = Array.isArray(reviews)
    ? reviews
    : ((reviews as any)?.data ?? []);
  const count =
    (reviews as any)?.metadata?.count ?? (reviews as any)?.count ?? data.length;
  const average_rating = await reviewService.getAverageRating(id);

  res.json({
    reviews: data,
    count,
    limit,
    offset,
    average_rating,
  });
};

export const POST = async (
  req: AuthenticatedMedusaRequest<PostStoreReviewReq>,
  res: MedusaResponse,
) => {
  const { id } = req.params;
  const input = req.validatedBody;

  const { result } = await createReviewWorkflow(req.scope).run({
    input: {
      ...input,
      product_id: id,
      customer_id: req.auth_context?.actor_id,
    },
  });

  res.json(result);
};
