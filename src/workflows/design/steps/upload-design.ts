import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { IFileModuleService } from "@medusajs/types";

interface UploadStepInput {
  files: {
    filename: string;
    mimeType: string;
    content: string; // base64 or buffer
    access?: "public" | "private";
  }[];
}

export const uploadDesignStep = createStep(
  "upload-design-step",
  async (input: UploadStepInput, { container }) => {
    const fileService: IFileModuleService = container.resolve(Modules.FILE);

    // Use the single s3 provider with 'designs/' prefix
    const uploadResult = await (fileService as any).create(
      input.files.map((f) => ({
        ...f,
        filename: `designs/${f.filename}`,
        access: "private",
      })),
      { provider_id: "s3" },
    );

    return new StepResponse(
      uploadResult,
      uploadResult.map((f) => f.id),
    );
  },
  async (fileIds: string[], { container }) => {
    const fileService: IFileModuleService = container.resolve(Modules.FILE);
    await (fileService as any).delete(fileIds);
  },
);
