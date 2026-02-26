import { medusaIntegrationTestRunner } from "@medusajs/test-utils";

jest.setTimeout(60 * 3000);

medusaIntegrationTestRunner({
  inApp: true,
  env: {},
  testSuite: ({ api }) => {
    describe("Designs API", () => {
      describe("POST /store/designs", () => {
        it("successfully creates a new design with the correct defaults and arrays", async () => {
          const payload = {
            title: "Test Design Upload",
            description: "Testing array upload structures",
            promotional_files: [
              {
                filename: "promo1.png",
                mimeType: "image/png",
                content: "base64data",
              },
              {
                filename: "promo2.png",
                mimeType: "image/png",
                content: "base64data",
              },
            ],
            design_files: [
              {
                filename: "design1.png",
                mimeType: "image/png",
                content: "base64data",
              },
            ],
            metadata: {
              test: true,
            },
            designer_id: "test-designer-123",
          };

          const response = await api.post("/store/designs", payload);

          // Verify the request succeeded
          expect(response.status).toEqual(200);
          expect(response.data).toHaveProperty("design");

          const design = response.data.design;

          // Verify the data structures
          expect(design.title).toEqual(payload.title);
          expect(design.description).toEqual(payload.description);
          expect(design.designer_id).toEqual(payload.designer_id);
          expect(design.metadata).toEqual(payload.metadata);

          // Verify array lengths based on dummy return URLs
          expect(design.promotional_images.length).toEqual(2);
          expect(design.design_images.length).toEqual(1);

          // Verify the default status
          expect(design.status).toEqual("PENDING_REVIEW");
        });
      });
    });
  },
});
