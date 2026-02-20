import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { upgradeToDesignerWorkflow } from "../../../workflows/designer/upgrade-to-designer";

type UpgradeDesignerInput = {
  bio?: string;
  portfolio_link?: string;
};

export async function POST(
  req: AuthenticatedMedusaRequest<UpgradeDesignerInput>,
  res: MedusaResponse,
) {
  const { result } = await upgradeToDesignerWorkflow(req.scope).run({
    input: {
      customer_id: req.auth_context.actor_id,
      bio: req.body.bio,
      portfolio_link: req.body.portfolio_link,
    },
  });

  res.json({ designer: result });
}
