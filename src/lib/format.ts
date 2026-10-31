import type { BookingStatus } from "./types";

export const formatMoney = (n: number) =>
  `$${(n ?? 0).toLocaleString("en-US")}`;

export const formatHourlyRate = (rate: number) => `${formatMoney(rate)}/hr`;

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatTime12 = (hhmm: string) => {
  const [h, m] = (hhmm ?? "00:00").split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m ?? 0).padStart(2, "0")} ${suffix}`;
};

export const formatRange = (start: string, end: string) =>
  `${formatTime12(start)} – ${formatTime12(end)}`;

export const bookingStatusMeta: Record<
  BookingStatus,
  { label: string; badge: string }
> = {
  Pending: { label: "Pending", badge: "badge-warning" },
  Confirmed: { label: "Confirmed", badge: "badge-success" },
  Completed: { label: "Completed", badge: "badge-info" },
  Cancelled: { label: "Cancelled", badge: "badge-error" },
};

export const timeToMinutes = (hhmm: string) => {
  const [h, m] = (hhmm ?? "00:00").split(":").map(Number);
  return h * 60 + (m || 0);
};

export const minutesToTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
