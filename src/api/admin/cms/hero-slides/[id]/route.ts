import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import StorefrontCmsService from "../../../../../modules/storefront-cms/service";
import { STOREFRONT_CMS_MODULE } from "../../../../../modules/storefront-cms";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: StorefrontCmsService = req.scope.resolve(
    STOREFRONT_CMS_MODULE,
  );
  const id = req.params.id;

  const heroSlide = await cmsService.retrieveHeroSlide(id);

  res.json({ hero_slide: heroSlide });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: StorefrontCmsService = req.scope.resolve(
    STOREFRONT_CMS_MODULE,
  );
  const id = req.params.id;

  const heroSlide = await cmsService.updateHeroSlides({
    id,
    ...(req.body as any),
  });

  res.json({ hero_slide: heroSlide });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: StorefrontCmsService = req.scope.resolve(
    STOREFRONT_CMS_MODULE,
  );
  const id = req.params.id;

  await cmsService.deleteHeroSlides(id);

  res.status(200).json({ id, deleted: true });
}
