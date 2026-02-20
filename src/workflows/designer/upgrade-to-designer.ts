import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { createDesignerStep } from "./steps/create-designer";
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
import { DESIGN_MODULE } from "../../modules/design";

import { updateCustomerGroupStep } from "./steps/update-customer-group";

export const upgradeToDesignerWorkflow = createWorkflow(
  "upgrade-to-designer",
  (input: { customer_id: string; bio?: string; portfolio_link?: string }) => {
    const designer = createDesignerStep({
      user_id: input.customer_id,
      bio: input.bio,
      portfolio_link: input.portfolio_link,
    });

    createRemoteLinkStep([
      {
        [Modules.CUSTOMER]: { customer_id: input.customer_id },
        [DESIGN_MODULE]: { designer_id: designer.id },
      },
    ]);

    updateCustomerGroupStep({ customer_id: input.customer_id });

    return new WorkflowResponse(designer);
  },
);
