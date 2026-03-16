export const mapStatusToColor = (
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "ordered"
    | "in_production"
    | "completed"
    | "cancelled",
) => {
  switch (status) {
    case "pending":
      return "orange";
    case "approved":
      return "green";
    case "rejected":
      return "red";
    case "ordered":
      return "blue";
    case "in_production":
      return "purple";
    case "completed":
      return "green";
    case "cancelled":
      return "grey";
    default:
      return "grey";
  }
};
