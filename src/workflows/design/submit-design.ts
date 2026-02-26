import {
  createWorkflow,
  WorkflowResponse,
  transform,
} from "@medusajs/framework/workflows-sdk";
import { uploadDesignStep } from "./steps/upload-design";
import { createDesignStep } from "./steps/create-design";

interface FileInput {
  filename: string;
  mimeType: string;
  content: string;
}

interface SubmitDesignWorkflowInput {
  promotional_files?: FileInput[];
  design_files: FileInput[];
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  designer_id: string;
}

export const submitDesignWorkflow = createWorkflow(
  "submit-design-workflow",
  (input: SubmitDesignWorkflowInput) => {
    // 1. Merge files for upload
    const allFiles = transform({ input }, (data) => [
      ...(data.input.promotional_files || []),
      ...(data.input.design_files || []),
    ]);

    // 2. Upload all files together
    const uploadedFiles = uploadDesignStep({ files: allFiles });

    // 3. Separate the returned URLs
    const promotional_images = transform({ uploadedFiles, input }, (data) => {
      const promoCount = data.input.promotional_files?.length || 0;
      return data.uploadedFiles.slice(0, promoCount).map((f: any) => f.url);
    });

    const design_images = transform({ uploadedFiles, input }, (data) => {
      const promoCount = data.input.promotional_files?.length || 0;
      return data.uploadedFiles.slice(promoCount).map((f: any) => f.url);
    });

    // 4. Create the design record linking to the uploaded file URLs
    const design = createDesignStep({
      title: input.title,
      description: input.description,
      promotional_images,
      design_images,
      metadata: input.metadata,
      designer_id: input.designer_id,
    });

    return new WorkflowResponse(design);
  },
);
