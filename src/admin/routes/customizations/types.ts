export type Customization = {
  id: string;
  customer_notes: string;
  status: string;
  product_id: string;
  variant_id: string;
  design_id: string;
  image_url: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
  selected_properties?: {
    id: string;
    property_name: string;
    selected_value: string;
    custom_value: string;
  }[];
};
