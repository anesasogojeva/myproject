export function orderStatusVariant(status) {
  if (status === "paid") return "success";
  if (status === "cancelled" || status === "canceled") return "danger";
  return "warning";
}
