import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { DESIGN_MODULE } from "../../../../modules/design";
import DesignService from "../../../../modules/design/service";

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { id } = req.params;

  // Since we want to display designer info based on CUSTOMER ID in the admin panel
  // We need to resolve the designer associated with this customer.
  // We can use the Remote Query to fetch the link.

  const {
    data: [link],
  } = await query.graph({
    entity: Modules.CUSTOMER,
    fields: ["designer.*"],
    filters: {
      id: [id],
    },
  });

  // If no designer link found for this customer
  // We should also check if the ID passed IS the designer ID (flexibility)
  // But the widget passes customer.id.

  // The graph query above should return the customer with the designer relation.
  // Actually, let's verify the relation name. It's likely defined in `links` folder.

  if (!link?.designer) {
    // Try to see if there is a designer with this ID directly (if called differently)
    // But for the widget use case, we are passing customer ID.
    // If no designer found, return 404 or null.
    res.status(404).json({ message: "Designer not found for this customer" });
    return;
  }

  res.json(link.designer);
}
