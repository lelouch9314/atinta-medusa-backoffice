import {
  MedusaRequest,
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { REVIEWS_MODULE } from "../../../../../modules/reviews";
import ReviewService from "../../../../../modules/reviews/service";

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
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const { id } = req.params;
  const { title, content, rating, first_name, last_name } = req.body as {
    title?: string;
    content: string;
    rating: number;
    first_name: string;
    last_name: string;
  };

  if (!content || !rating || !first_name || !last_name) {
    res.status(400).json({
      message:
        "Missing required fields: content, rating, first_name, last_name",
    });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
    return;
  }

  const reviewService: ReviewService = req.scope.resolve(REVIEWS_MODULE);

  const customer_id = req.auth_context?.actor_id ?? null;

  const reviews = await reviewService.createReviews({
    product_id: id,
    title: title ?? null,
    content,
    rating,
    first_name,
    last_name,
    status: "pending",
    customer_id,
  });
  const review = Array.isArray(reviews) ? reviews[0] : reviews;

  res.status(201).json({ review });
};
