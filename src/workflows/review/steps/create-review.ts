import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { REVIEWS_MODULE } from "../../../modules/reviews";
import ReviewService from "../../../modules/reviews/service";

export type CreateReviewStepInput = {
  title?: string;
  content: string;
  rating: number;
  product_id: string;
  customer_id?: string;
  first_name: string;
  last_name: string;
  status?: "pending" | "approved" | "rejected";
};

export const createReviewStep = createStep(
  "create-review",
  async (input: CreateReviewStepInput, { container }) => {
    const reviewModuleService: ReviewService =
      container.resolve(REVIEWS_MODULE);

    const review = await reviewModuleService.createReviews(input);

    return new StepResponse(review, review.id);
  },
  async (reviewId, { container }) => {
    if (!reviewId) {
      return;
    }

    const reviewModuleService: ReviewService =
      container.resolve(REVIEWS_MODULE);

    await reviewModuleService.deleteReviews(reviewId);
  },
);
