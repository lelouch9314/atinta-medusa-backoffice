export type ProfessionalDesignRequest = {
  id: string;
  company_name: string;
  industry: string;
  description: string;
  accent_colors?: string;
  style?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  customer_id: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  customer?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};
