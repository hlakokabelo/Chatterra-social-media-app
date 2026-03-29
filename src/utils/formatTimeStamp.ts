export function formatTimeStamp(
  isoTimestamp: string,
  withMinutes: boolean = true,
): string {
  const date = new Date(isoTimestamp);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const pad = (num: number) => String(num).padStart(2, "0");

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const timeStr = `${hours}:${minutes}`;

  // Same day → relative time (e.g. "2hrs 5min ago")
  if (withMinutes && diffDays === 0) {
    const diffSeconds = Math.floor(diffMs / 1000);
    const hrs = Math.floor(diffSeconds / 3600);
    const mins = Math.floor((diffSeconds % 3600) / 60);

    const hrsPart = hrs > 0 ? `${hrs}${hrs > 1 ? "hrs" : "hr"} ` : "";
    const minsPart = `${mins}min`;

    return `${hrsPart}${minsPart} ago`.trim();
  }

  // Same day → exact time
  if (diffDays === 0) {
    return timeStr;
  }

  // Yesterday
  if (diffDays === 1) {
    return `Yesterday ${timeStr}`;
  }

  // Within last 7 days → day name + time
  if (diffDays < 7) {
    const dayShort = dayNames[date.getDay()];
    return `${dayShort} ${timeStr}`;
  }

  // Older → date + optional year + time
  let datePart = `${date.getDate()} ${monthNames[date.getMonth()]}`;
  if (date.getFullYear() !== now.getFullYear()) {
    datePart += ` ${date.getFullYear()}`;
  }

  return `${datePart}, ${timeStr}`;
}