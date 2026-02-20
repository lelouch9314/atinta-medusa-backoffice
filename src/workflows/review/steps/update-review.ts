import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import ReviewService from "../../../modules/reviews/service";
import { REVIEWS_MODULE } from "../../../modules/reviews";
export type UpdateReviewsStepInput = {
  id: string;
  status: "pending" | "approved" | "rejected";
}[];

export const updateReviewsStep = createStep(
  "update-review-step",
  async (input: UpdateReviewsStepInput, { container }) => {
    const reviewModuleService: ReviewService =
      container.resolve(REVIEWS_MODULE);

    // Get original review before update
    const originalReviews = await reviewModuleService.listReviews({
      id: input.map((review) => review.id),
    });

    const reviews = await reviewModuleService.updateReviews(input);

    return new StepResponse(reviews, originalReviews);
  },
  async (originalData, { container }) => {
    if (!originalData) {
      return;
    }

    const reviewModuleService: ReviewService =
      container.resolve(REVIEWS_MODULE);

    // Restore original review status
    await reviewModuleService.updateReviews(originalData);
  },
);
