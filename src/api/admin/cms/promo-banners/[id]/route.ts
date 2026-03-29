import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import StorefrontCmsService from "../../../../../modules/storefront-cms/service";
import { STOREFRONT_CMS_MODULE } from "../../../../../modules/storefront-cms";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: StorefrontCmsService = req.scope.resolve(
    STOREFRONT_CMS_MODULE,
  );
  const id = req.params.id;

  const promoBanner = await cmsService.retrievePromoBanner(id);

  res.json({ promo_banner: promoBanner });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: StorefrontCmsService = req.scope.resolve(
    STOREFRONT_CMS_MODULE,
  );
  const id = req.params.id;

  const promoBanner = await cmsService.updatePromoBanners({
    id,
    ...(req.body as any),
  });

  res.json({ promo_banner: promoBanner });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: StorefrontCmsService = req.scope.resolve(
    STOREFRONT_CMS_MODULE,
  );
  const id = req.params.id;

  await cmsService.deletePromoBanners(id);

  res.status(200).json({ id, deleted: true });
}
