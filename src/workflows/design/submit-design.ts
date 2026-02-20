import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { uploadDesignStep } from "./steps/upload-design";
import { createDesignStep } from "./steps/create-design";

interface SubmitDesignWorkflowInput {
  files: {
    filename: string;
    mimeType: string;
    content: string;
  }[];
  title: string;
  description?: string;
  designer_id: string;
}

export const submitDesignWorkflow = createWorkflow(
  "submit-design-workflow",
  (input: SubmitDesignWorkflowInput) => {
    // 1. Upload the file
    const uploadedFiles = uploadDesignStep({ files: input.files });

    // 2. Create the design record linking to the uploaded file URL
    // We assume single file upload for now, so we take the first URL
    const design = createDesignStep({
      title: input.title,
      description: input.description,
      image_url: uploadedFiles[0].url,
      designer_id: input.designer_id,
    });

    return new WorkflowResponse(design);
  },
);
