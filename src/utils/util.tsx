export function formatTimeStamp(
  isoTimestamp: string,
  withMinutes: boolean = true,
) {
  const date: any = new Date(isoTimestamp);
  const now: any = new Date();

  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const pad = (num: any) => String(num).padStart(2, "0");

  // Same day → just time

  if (withMinutes && diffDays === 0) {
    const diffMs = now - date; // difference in milliseconds

    const diffSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);

    const timeStr =
      (hours > 0 ? hours + (hours > 1 ? "hrs" : "hr") : "") +
      " " +
      (minutes + (minutes > 1 ? "min" : "min")) +
      " ago";
    return timeStr; // e.g. "14:35"
  }
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const timeStr = `${hours}:${minutes}`;

  // time (Instagram often does this)
  if (diffDays === 0) {
    return ` ${timeStr}`; // e.g. "Yesterday 14:35"
  }
  if (diffDays === 1) {
    return `Yesterday ${timeStr}`; // e.g. "Yesterday 14:35"
  }

  // Within last 7 days → short day name + time
  if (diffDays <= 6) {
    const dayShort = dayNames[date.getDay()];
    return `${dayShort} ${timeStr}`; // e.g. "Thu 14:35"
  }

  // Older → day month [year if not current] + time
  let datePart = `${date.getDate()} ${monthNames[date.getMonth()]}`;
  if (date.getFullYear() !== now.getFullYear()) {
    datePart += ` ${date.getFullYear()}`;
  }

  return `${datePart}, ${timeStr}`; // e.g. "23 Jan 2026, 23:05" or "23 Jan, 23:05"
}

const getHours = (time: number): number => {
  if (time >= 60) {
    return 1 + getHours(time - 60);
  }
  return 0;
};
