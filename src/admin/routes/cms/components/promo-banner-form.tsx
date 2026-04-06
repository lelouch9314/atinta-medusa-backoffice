import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Select,
  Switch,
  toast,
} from "@medusajs/ui";
import { useMutation } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { sdk } from "../../../lib/sdk";
import { PromoBannerType } from "../../../../modules/storefront-cms";
import { ColorPicker } from "./color-picker";

type Props = {
  banner: PromoBannerType | null;
  onClose: () => void;
  onSaved: () => void;
};

export function PromoBannerForm({ banner, onClose, onSaved }: Props) {
  const isEdit = !!banner;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    description: banner?.description || "",
    image_url: banner?.image_url || "",
    button_text: banner?.button_text || "",
    button_link: banner?.button_link || "",
    bg_color_from: banner?.bg_color_from || "#fef2f2",
    bg_color_to: banner?.bg_color_to || "#fee2e2",
    text_color: banner?.text_color || "#991b1b",
    accent_color: banner?.accent_color || "#dc2626",
    button_color: banner?.button_color || "#dc2626",
    sort_order: banner?.sort_order ?? 0,
    is_active: banner?.is_active ?? false,
    layout: banner?.layout || "half",
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
        ? `/admin/cms/promo-banners/${banner!.id}`
        : "/admin/cms/promo-banners";
      return sdk.client.fetch(url, {
        method: "POST",
        body: form,
      });
    },
    onSuccess: () => {
      toast.success(isEdit ? "Banner actualizado" : "Banner creado");
      onSaved();
    },
    onError: () => toast.error("Error al guardar"),
  });

  return (
    <FocusModal open onOpenChange={(open) => !open && onClose()}>
      <FocusModal.Content>
        <FocusModal.Header>
          <Heading>{isEdit ? "Edit Banner" : "New Promo Banner"}</Heading>
        </FocusModal.Header>
        <FocusModal.Body className="p-0 flex h-full">
          {/* Left Side: Form */}
          <div className="flex-[0.7] p-6 pb-20 overflow-y-auto border-r border-ui-border-base bg-ui-bg-subtle">
            <div className="flex flex-col gap-6 max-w-xl mx-auto">
              <section className="space-y-4">
                <Heading level="h2">Content & Layout</Heading>
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Banner title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={form.subtitle}
                      onChange={(e) => handleChange("subtitle", e.target.value)}
                      placeholder="Small label above title"
                    />
                  </div>
                  <div>
                    <Label>Layout</Label>
                    <Select
                      value={form.layout}
                      onValueChange={(val) => handleChange("layout", val)}
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="half">Half Width</Select.Item>
                        <Select.Item value="full">Full Width</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Banner description"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <Heading level="h2">Action</Heading>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Button Text</Label>
                    <Input
                      value={form.button_text}
                      onChange={(e) =>
                        handleChange("button_text", e.target.value)
                      }
                      placeholder="e.g. Shop Now"
                    />
                  </div>
                  <div>
                    <Label>Button Link</Label>
                    <Input
                      value={form.button_link}
                      onChange={(e) =>
                        handleChange("button_link", e.target.value)
                      }
                      placeholder="e.g. /products"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <Heading level="h2">Color Palette</Heading>
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker
                    label="Background Color (From)"
                    value={form.bg_color_from}
                    onChange={(val) => handleChange("bg_color_from", val)}
                  />
                  <ColorPicker
                    label="Background Color (To)"
                    value={form.bg_color_to}
                    onChange={(val) => handleChange("bg_color_to", val)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={form.text_color}
                    onChange={(val) => handleChange("text_color", val)}
                  />
                  <ColorPicker
                    label="Accent/Price Color"
                    value={form.accent_color}
                    onChange={(val) => handleChange("accent_color", val)}
                  />
                  <ColorPicker
                    label="Button Color"
                    value={form.button_color}
                    onChange={(val) => handleChange("button_color", val)}
                  />
                  <div>
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={String(form.sort_order)}
                      onChange={(e) =>
                        handleChange(
                          "sort_order",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <Heading level="h2">Media</Heading>
                <div>
                  <Label>Image</Label>
                  <div className="flex items-center gap-4 mt-1">
                    {form.image_url && (
                      <img
                        src={form.image_url}
                        alt="Preview"
                        className="h-24 w-36 rounded-md object-cover border border-ui-border-base"
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
              </section>

              <div className="flex items-center gap-2 border-t border-ui-border-base pt-6">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) =>
                    handleChange("is_active", checked)
                  }
                />
                <Label>Active (visible on storefront)</Label>
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
                  {isEdit ? "Update Banner" : "Create Banner"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side: Preview */}
          <div className="flex-1 bg-ui-bg-base flex flex-col items-center justify-center p-12 overflow-hidden">
            <div
              className={`w-full rounded-2xl shadow-2xl overflow-hidden relative border border-ui-border-base transition-all duration-300 ${
                form.layout === "full"
                  ? "max-w-4xl aspect-[21/9]"
                  : "max-w-xl aspect-[4/3]"
              }`}
            >
              <div
                className={`w-full h-full flex flex-col justify-center p-8 md:p-12 transition-all`}
                style={{
                  background: `linear-gradient(to bottom right, ${form.bg_color_from}, ${form.bg_color_to})`,
                  color: form.text_color,
                }}
              >
                <div
                  className={`${form.layout === "full" ? "grid grid-cols-2 gap-8 items-center" : "flex flex-col gap-4"} h-full`}
                >
                  <div className="space-y-4">
                    {form.subtitle && (
                      <p
                        className="text-xs uppercase font-bold tracking-widest"
                        style={{ color: form.accent_color }}
                      >
                        {form.subtitle}
                      </p>
                    )}
                    <h3
                      className={`font-bold leading-tight ${form.layout === "full" ? "text-4xl" : "text-3xl"}`}
                    >
                      {form.title || "Summer Sale"}
                    </h3>
                    {form.description && (
                      <p className="opacity-80 line-clamp-3">
                        {form.description}
                      </p>
                    )}
                    {form.button_text && (
                      <div className="pt-2">
                        <Button
                          className="hover:opacity-90 transition-opacity"
                          style={{
                            backgroundColor: form.button_color,
                            color: "#ffffff",
                          }}
                        >
                          {form.button_text}
                        </Button>
                      </div>
                    )}
                  </div>

                  {form.layout === "full" ? (
                    <div className="flex justify-center h-full items-center">
                      {form.image_url ? (
                        <img
                          src={form.image_url}
                          alt="Preview"
                          className="max-h-[80%] rounded-lg shadow-2xl"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-black/10 rounded-xl border-2 border-dashed border-black/20 flex items-center justify-center text-black/40 italic">
                          No Image
                        </div>
                      )}
                    </div>
                  ) : (
                    form.image_url && (
                      <div className="absolute top-0 right-0 w-1/2 h-full -z-0 opacity-20 pointer-events-none">
                        <img
                          src={form.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                {form.layout === "full"
                  ? "Full Width Preview"
                  : "Half Width Preview"}
              </div>
            </div>

            <p className="mt-8 text-sm text-ui-fg-muted max-w-md text-center">
              The preview dynamically adjusts based on the selected layout (
              {form.layout}). Colors and placement are simulated based on the
              storefront's design.
            </p>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
}
