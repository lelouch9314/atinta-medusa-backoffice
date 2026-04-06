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
import { ColorPicker } from "./color-picker";

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
    bg_color_from: slide?.bg_color_from || "#ec4899",
    bg_color_to: slide?.bg_color_to || "#e11d48",
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
        <FocusModal.Body className="p-0 flex h-full">
          {/* Left Side: Form */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-ui-border-base bg-ui-bg-subtle">
            <div className="flex flex-col gap-6 max-w-xl mx-auto">
              <section className="space-y-4">
                <Heading level="h2">Content</Heading>
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
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Slide description"
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
                      placeholder="e.g. /design-editor"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <Heading level="h2">Appearance & Sorting</Heading>
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
          </div>

          {/* Right Side: Preview */}
          <div className="flex-[0.8] bg-ui-bg-base flex flex-col items-center justify-center p-12 overflow-hidden">
            <div className="w-full max-w-4xl aspect-[21/9] rounded-2xl shadow-2xl overflow-hidden relative border border-ui-border-base transition-all">
              <div
                className="w-full h-full text-white flex items-center p-8 md:p-12"
                style={{
                  background: `linear-gradient(to bottom right, ${form.bg_color_from}, ${form.bg_color_to})`,
                }}
              >
                <div className="grid grid-cols-2 gap-8 items-center w-full">
                  <div className="space-y-4">
                    {form.subtitle && (
                      <p className="text-sm font-medium opacity-90">
                        {form.subtitle}
                      </p>
                    )}
                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight line-clamp-2">
                      {form.title || "Your Title Here"}
                    </h1>
                    <p className="text-lg opacity-90 line-clamp-2">
                      {form.description ||
                        "Brief description of this hero slide..."}{" "}
                      {form.discount && (
                        <span className="text-yellow-300 font-bold ml-1">
                          -{form.discount}
                        </span>
                      )}
                    </p>
                    {form.button_text && (
                      <Button className="bg-white text-black hover:bg-white/90">
                        {form.button_text}
                      </Button>
                    )}
                  </div>
                  <div className="flex justify-center h-full">
                    <div className="relative w-full aspect-square max-w-[280px]">
                      {form.image_url ? (
                        <img
                          src={form.image_url}
                          alt="Preview"
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 italic">
                          No Image Uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                Live Preview
              </div>
            </div>

            <p className="mt-8 text-sm text-ui-fg-muted max-w-md text-center">
              This preview reflects how the hero slide will look on the
              storefront. Use the controls on the left to customize colors and
              content.
            </p>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
}
