import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import StorefrontCmsService from "../../../../modules/storefront-cms/service";
import { STOREFRONT_CMS_MODULE } from "../../../../modules/storefront-cms";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cmsService: StorefrontCmsService = req.scope.resolve(
    STOREFRONT_CMS_MODULE,
  );

  const promoBanners = await cmsService.listPromoBanners(
    { is_active: true },
    { order: { sort_order: "ASC" } },
  );

  res.json({ promo_banners: promoBanners });
}
