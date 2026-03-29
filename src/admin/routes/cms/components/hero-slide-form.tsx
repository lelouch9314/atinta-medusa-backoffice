import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Switch,
  toast,
} from "@medusajs/ui";
import { useMutation } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { sdk } from "../../../lib/sdk";
import { HeroSlideType } from "../../../../modules/storefront-cms";

type Props = {
  slide: HeroSlideType | null;
  onClose: () => void;
  onSaved: () => void;
};

export function HeroSlideForm({ slide, onClose, onSaved }: Props) {
  const isEdit = !!slide;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    discount: slide?.discount || "",
    description: slide?.description || "",
    image_url: slide?.image_url || "",
    button_text: slide?.button_text || "",
    button_link: slide?.button_link || "",
    bg_gradient:
      slide?.bg_gradient || "bg-gradient-to-br from-pink-500 to-rose-600",
    sort_order: slide?.sort_order ?? 0,
    is_active: slide?.is_active ?? true,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/admin/cms/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (data.files?.[0]?.url) {
        handleChange("image_url", data.files[0].url);
        toast.success("Imagen subida correctamente");
      }
    } catch (err) {
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const url = isEdit
        ? `/admin/cms/hero-slides/${slide!.id}`
        : "/admin/cms/hero-slides";
      return sdk.client.fetch(url, {
        method: "POST",
        body: form,
      });
    },
    onSuccess: () => {
      toast.success(isEdit ? "Slide actualizado" : "Slide creado");
      onSaved();
    },
    onError: () => toast.error("Error al guardar"),
  });

  return (
    <FocusModal open onOpenChange={(open) => !open && onClose()}>
      <FocusModal.Content>
        <FocusModal.Header>
          <Heading>{isEdit ? "Edit Slide" : "New Hero Slide"}</Heading>
        </FocusModal.Header>
        <FocusModal.Body className="p-6 overflow-y-auto">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Slide title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={form.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  placeholder="Sub-heading"
                />
              </div>
              <div>
                <Label>Discount Label</Label>
                <Input
                  value={form.discount}
                  onChange={(e) => handleChange("discount", e.target.value)}
                  placeholder="e.g. 20% OFF"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Slide description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Button Text</Label>
                <Input
                  value={form.button_text}
                  onChange={(e) => handleChange("button_text", e.target.value)}
                  placeholder="e.g. Shop Now"
                />
              </div>
              <div>
                <Label>Button Link</Label>
                <Input
                  value={form.button_link}
                  onChange={(e) => handleChange("button_link", e.target.value)}
                  placeholder="e.g. /design-editor"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Background Gradient</Label>
                <Input
                  value={form.bg_gradient}
                  onChange={(e) => handleChange("bg_gradient", e.target.value)}
                  placeholder="e.g. bg-gradient-to-br from-pink-500 to-rose-600"
                />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={String(form.sort_order)}
                  onChange={(e) =>
                    handleChange("sort_order", parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </div>

            <div>
              <Label>Image</Label>
              <div className="flex items-center gap-4 mt-1">
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="h-24 w-36 rounded-md object-cover border"
                  />
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={uploading}
                  >
                    {form.image_url ? "Change Image" : "Upload Image"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) =>
                  handleChange("is_active", checked)
                }
              />
              <Label>Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => saveMutation.mutate()}
                isLoading={saveMutation.isPending}
                disabled={!form.title}
              >
                {isEdit ? "Update Slide" : "Create Slide"}
              </Button>
            </div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
}
