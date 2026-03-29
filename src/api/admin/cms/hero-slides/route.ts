import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import StorefrontCmsService from "../../../../modules/storefront-cms/service";
import { STOREFRONT_CMS_MODULE } from "../../../../modules/storefront-cms";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: StorefrontCmsService = req.scope.resolve(
    STOREFRONT_CMS_MODULE,
  );

  const [heroSlides, count] = await cmsService.listAndCountHeroSlides(
    {},
    {
      order: { sort_order: "ASC" },
      skip: Number(req.query.offset) || 0,
      take: Number(req.query.limit) || 20,
    },
  );

  res.json({
    hero_slides: heroSlides,
    count,
    offset: Number(req.query.offset) || 0,
    limit: Number(req.query.limit) || 20,
  });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: StorefrontCmsService = req.scope.resolve(
    STOREFRONT_CMS_MODULE,
  );

  const heroSlide = await cmsService.createHeroSlides(req.body as any);

  res.status(201).json({ hero_slide: heroSlide });
}
