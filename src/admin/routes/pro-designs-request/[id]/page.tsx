import { defineRouteConfig } from "@medusajs/admin-sdk";
import { useParams } from "react-router-dom";

export default function RequestDetails() {
  const { id } = useParams();

  return <>DETAILS {id}</>;
}

export const config = defineRouteConfig({
  label: "Designs Requests Details",
});
