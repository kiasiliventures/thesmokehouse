export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatStatus(status: string): string {
  return status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
