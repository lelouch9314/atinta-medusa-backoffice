import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { z } from "zod";
import CustomizationService from "../../../../modules/customization/service";
import { CUSTOMIZATION_MODULE } from "../../../../modules/customization";
import { updateCustomizationWorkflow } from "../../../../workflows/customization/update-customization";
import { approveCustomizationWorkflow } from "../../../../workflows/customization/approve-customization";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const { id } = req.params;
  const customizationModule: CustomizationService =
    req.scope.resolve(CUSTOMIZATION_MODULE);

  const customization = await customizationModule.retrieveCustomization(id, {
    relations: ["selected_properties"],
  });

  res.json({ customization });
};

export const PostAdminUpdateCustomizationSchema = z.object({
  status: z
    .enum([
      "DRAFT",
      "PENDING",
      "APPROVED",
      "REJECTED",
      "ORDERED",
      "IN_PRODUCTION",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
  admin_notes: z.string().nullable().optional(),
});

export const POST = async (
  req: AuthenticatedMedusaRequest<
    z.infer<typeof PostAdminUpdateCustomizationSchema>
  >,
  res: MedusaResponse,
) => {
  const { id } = req.params;
  console.log("id", req.body);
  const { status, admin_notes } = PostAdminUpdateCustomizationSchema.parse(
    req.body,
  );
  const customizationModule: CustomizationService =
    req.scope.resolve(CUSTOMIZATION_MODULE);

  let customization = await customizationModule.retrieveCustomization(id);
  const wasNotApproved = customization.status !== "APPROVED";

  const { result } = await updateCustomizationWorkflow(req.scope).run({
    input: [
      {
        id,
        status,
        admin_notes: admin_notes !== undefined ? admin_notes : undefined,
      },
    ],
  });

  if (status === "APPROVED" && wasNotApproved) {
    await approveCustomizationWorkflow(req.scope).run({
      input: {
        id: customization.id,
        variant_id: customization.variant_id,
        customer_id: customization.customer_id,
      },
    });
  }

  res.json({ customization: result[0] });
};
