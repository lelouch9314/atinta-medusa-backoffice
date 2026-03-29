import { defineRouteConfig } from "@medusajs/admin-sdk";
import { SquaresPlus } from "@medusajs/icons";
import {
  Button,
  Container,
  Heading,
  StatusBadge,
  Switch,
  Tabs,
  toast,
  Toaster,
} from "@medusajs/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { sdk } from "../../lib/sdk";
import {
  HeroSlideType,
  PromoBannerType,
} from "../../../modules/storefront-cms";
import { HeroSlideForm } from "./components/hero-slide-form";
import { PromoBannerForm } from "./components/promo-banner-form";

export default function CmsPage() {
  return (
    <div className="flex flex-col gap-y-4">
      <Container>
        <Heading>CMS - Storefront Content</Heading>
      </Container>
      <Tabs defaultValue="hero">
        <Tabs.List>
          <Tabs.Trigger value="hero">Hero Slider</Tabs.Trigger>
          <Tabs.Trigger value="banners">Banners</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="hero">
          <HeroSlidesTab />
        </Tabs.Content>
        <Tabs.Content value="banners">
          <PromoBannersTab />
        </Tabs.Content>
      </Tabs>
      <Toaster />
    </div>
  );
}

function HeroSlidesTab() {
  const queryClient = useQueryClient();
  const [editingSlide, setEditingSlide] = useState<HeroSlideType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery<{
    hero_slides: HeroSlideType[];
    count: number;
  }>({
    queryKey: ["cms", "hero-slides"],
    queryFn: () => sdk.client.fetch("/admin/cms/hero-slides"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch(`/admin/cms/hero-slides/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Slide eliminado");
      queryClient.invalidateQueries({ queryKey: ["cms", "hero-slides"] });
    },
    onError: () => toast.error("Error al eliminar"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      sdk.client.fetch(`/admin/cms/hero-slides/${id}`, {
        method: "POST",
        body: { is_active },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "hero-slides"] });
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setShowForm(true);
  };

  const handleOpenEdit = (slide: HeroSlideType) => {
    setEditingSlide(slide);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingSlide(null);
  };

  return (
    <Container className="mt-4">
      <div className="flex items-center justify-between mb-6">
        <Heading level="h2">Hero Slides</Heading>
        <Button onClick={handleOpenCreate}>+ Add Slide</Button>
      </div>

      {isLoading && <p className="text-ui-fg-muted">Loading...</p>}

      <div className="flex flex-col gap-4">
        {data?.hero_slides?.map((slide) => (
          <div
            key={slide.id}
            className="flex items-center gap-4 rounded-lg border p-4"
          >
            {slide.image_url && (
              <img
                src={slide.image_url}
                alt={slide.title}
                className="h-20 w-32 rounded-md object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{slide.title}</p>
              <p className="text-sm text-ui-fg-muted truncate">
                {slide.subtitle}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge color={slide.is_active ? "green" : "grey"}>
                  {slide.is_active ? "Active" : "Inactive"}
                </StatusBadge>
                <span className="text-xs text-ui-fg-muted">
                  Order: {slide.sort_order}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={slide.is_active}
                onCheckedChange={(checked) =>
                  toggleMutation.mutate({
                    id: slide.id,
                    is_active: checked,
                  })
                }
              />
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleOpenEdit(slide)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => deleteMutation.mutate(slide.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        {!isLoading &&
          (!data?.hero_slides || data.hero_slides.length === 0) && (
            <div className="text-center py-12 text-ui-fg-muted">
              <p>No hero slides configured.</p>
              <p className="text-sm">
                The storefront will use default slides until you add custom
                ones.
              </p>
            </div>
          )}
      </div>

      {showForm && (
        <HeroSlideForm
          slide={editingSlide}
          onClose={handleClose}
          onSaved={() => {
            handleClose();
            queryClient.invalidateQueries({
              queryKey: ["cms", "hero-slides"],
            });
          }}
        />
      )}
    </Container>
  );
}

function PromoBannersTab() {
  const queryClient = useQueryClient();
  const [editingBanner, setEditingBanner] = useState<PromoBannerType | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery<{
    promo_banners: PromoBannerType[];
    count: number;
  }>({
    queryKey: ["cms", "promo-banners"],
    queryFn: () => sdk.client.fetch("/admin/cms/promo-banners"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch(`/admin/cms/promo-banners/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Banner eliminado");
      queryClient.invalidateQueries({ queryKey: ["cms", "promo-banners"] });
    },
    onError: () => toast.error("Error al eliminar"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      sdk.client.fetch(`/admin/cms/promo-banners/${id}`, {
        method: "POST",
        body: { is_active },
      }),
    onSuccess: () => {
      toast.success("Banner actualizado");
      queryClient.invalidateQueries({ queryKey: ["cms", "promo-banners"] });
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setShowForm(true);
  };

  const handleOpenEdit = (banner: PromoBannerType) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingBanner(null);
  };

  return (
    <Container className="mt-4">
      <div className="flex items-center justify-between mb-6">
        <Heading level="h2">Promo Banners</Heading>
        <Button onClick={handleOpenCreate}>+ Create Banner</Button>
      </div>

      {isLoading && <p className="text-ui-fg-muted">Loading...</p>}

      <div className="flex flex-col gap-4">
        {data?.promo_banners?.map((banner) => (
          <div
            key={banner.id}
            className="flex items-center gap-4 rounded-lg border p-4"
          >
            {banner.image_url && (
              <img
                src={banner.image_url}
                alt={banner.title}
                className="h-20 w-32 rounded-md object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{banner.title}</p>
              <p className="text-sm text-ui-fg-muted truncate">
                {banner.subtitle}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge color={banner.is_active ? "green" : "grey"}>
                  {banner.is_active ? "Active" : "Inactive"}
                </StatusBadge>
                <StatusBadge color="blue">
                  {banner.layout === "full" ? "Full Width" : "Half Width"}
                </StatusBadge>
                <span className="text-xs text-ui-fg-muted">
                  Order: {banner.sort_order}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={banner.is_active}
                onCheckedChange={(checked) =>
                  toggleMutation.mutate({
                    id: banner.id,
                    is_active: checked,
                  })
                }
              />
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleOpenEdit(banner)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => deleteMutation.mutate(banner.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        {!isLoading &&
          (!data?.promo_banners || data.promo_banners.length === 0) && (
            <div className="text-center py-12 text-ui-fg-muted">
              <p>No banners created yet.</p>
              <p className="text-sm">
                Create banners and enable them to display on the storefront.
              </p>
            </div>
          )}
      </div>

      {showForm && (
        <PromoBannerForm
          banner={editingBanner}
          onClose={handleClose}
          onSaved={() => {
            handleClose();
            queryClient.invalidateQueries({
              queryKey: ["cms", "promo-banners"],
            });
          }}
        />
      )}
    </Container>
  );
}

export const config = defineRouteConfig({
  label: "CMS",
  icon: SquaresPlus,
});
