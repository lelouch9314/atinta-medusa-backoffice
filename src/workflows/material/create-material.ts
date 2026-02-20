import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { uploadMaterialStep } from "./steps/upload-material";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

interface CreateMaterialInput {
  title: string;
  description?: string;
  files: {
    filename: string;
    mimeType: string;
    content: string;
  }[];
  options: { title: string; values: string[] }[];
  variants: any[];
  print_areas?: any; // Custom metadata validation could happen here
}

import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { IProductModuleService } from "@medusajs/types";

export const createMaterialProductStep = createStep(
  "create-material-product-step",
  async (input: any, { container }) => {
    const productService: IProductModuleService = container.resolve(
      Modules.PRODUCT,
    );

    const product = await productService.createProducts({
      title: input.title,
      description: input.description,
      images: input.images.map((f: any) => ({ url: f.url })),
      options: input.options,
      variants: input.variants, // needs proper formatting
      metadata: {
        is_material: true,
        print_areas: input.print_areas,
      },
      status: "published",
    });

    return new StepResponse(product, product.id);
  },
  async (id: string, { container }) => {
    const productService: IProductModuleService = container.resolve(
      Modules.PRODUCT,
    );
    await productService.deleteProducts([id]);
  },
);

export const createMaterialWorkflow = createWorkflow(
  "create-material-workflow",
  (input: CreateMaterialInput) => {
    // 1. Upload images to material bucket
    const uploadedFiles = uploadMaterialStep({ files: input.files });

    // 2. Map upload results to Product Input
    // We need to transform the input to match createProductsWorkflow expectation
    // Since workflows are declarative, we might need a transform step or direct mapping if supported
    // For simplicity, we'll assume we pass the file URLs to the product images

    // Note: workflow-sdk doesn't allow arbitrary JS mapping block easily without a step.
    // We should rely on a step to prepare the product input if logic is needed.
    // However, createProductsWorkflow expects specific input.
    // Let's create a custom step to wrap product creation OR use the core workflow as a sub-workflow.

    // Using core workflow directly is tricky if we need to inject the URLs from the previous step dynamically
    // without a transform step.
    // But we can invoke createProductsWorkflow.runAsStep()? No, createProductsWorkflow IS a workflow.

    // For this MVP, let's create a 'createMaterialProductStep' that calls the Product Module Service directly,
    // similar to how we did for Designs. It gives us more control over the custom metadata/logic.

    const product = createMaterialProductStep({
      title: input.title,
      description: input.description,
      images: uploadedFiles,
      options: input.options,
      variants: input.variants,
      print_areas: input.print_areas,
    });

    return new WorkflowResponse(product);
  },
);
