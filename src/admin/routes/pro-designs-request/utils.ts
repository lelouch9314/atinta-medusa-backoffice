export const mapStatusToColor = (
  status: "pending" | "processing" | "completed" | "cancelled",
) => {
  switch (status) {
    case "pending":
      return "grey";
    case "processing":
      return "orange";
    case "completed":
      return "green";
    case "cancelled":
      return "red";
  }
};
