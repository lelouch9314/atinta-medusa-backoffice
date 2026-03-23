import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const { id } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["customization.*"],
    filters: {
      id: [id],
    },
  });

  if (!orders.length) {
    return res.status(404).json({ message: "Order not found" });
  }

  const customization = orders[0].customization; // Assuming customization returns an array from the link, or single object

  res.json({ customization: customization || null });
};
