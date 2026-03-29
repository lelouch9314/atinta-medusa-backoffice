import { Module } from "@medusajs/framework/utils";
import StorefrontCmsService from "./service";
import { InferTypeOf } from "@medusajs/framework/types";
import { HeroSlide } from "./models/hero-slide";
import { PromoBanner } from "./models/promo-banner";

export type HeroSlideType = InferTypeOf<typeof HeroSlide>;
export type PromoBannerType = InferTypeOf<typeof PromoBanner>;

export const STOREFRONT_CMS_MODULE = "storefrontCms";

export default Module(STOREFRONT_CMS_MODULE, {
  service: StorefrontCmsService,
});
