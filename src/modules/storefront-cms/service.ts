import { MedusaService } from "@medusajs/framework/utils";
import { HeroSlide } from "./models/hero-slide";
import { PromoBanner } from "./models/promo-banner";

class StorefrontCmsService extends MedusaService({
  HeroSlide,
  PromoBanner,
}) {}

export default StorefrontCmsService;
