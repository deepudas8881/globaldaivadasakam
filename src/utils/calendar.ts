export function generateGoogleCalendarUrl(): string {
  const title = encodeURIComponent("One World, One Prayer · Global Daivadasakam Prayer");
  const details = encodeURIComponent(
    "Global Daivadasakam prayer gathering conducted by Sree Narayana Forum for Universal Brotherhood, Germany (Chairman: Dr. Varun Radhakrishnan).\n\nInspired by the universal vision of Sree Narayana Guru.\n\nRecitation of Daivadasakam in a shared spirit of peace, universal brotherhood, and human unity.\n\nTime: 7:00 PM IST (India Time) / 03:30 PM CEST (Germany/Europe) on Sunday, 25 October 2026."
  );
  const location = encodeURIComponent("Global Livestream & Local Gathering Hubs Worldwide");
  // 2026-10-25 19:00 IST = 2026-10-25 13:30 UTC to 15:00 UTC
  const dates = "20261025T133000Z/20261025T150000Z";
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

export function downloadIcsFile(): void {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sree Narayana Forum Germany//Global Daivadasakam//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:global-daivadasakam-20261025-1900ist@oneworldoneprayer",
    "DTSTAMP:20261015T000000Z",
    "DTSTART:20261025T133000Z",
    "DTEND:20261025T150000Z",
    "SUMMARY:One World, One Prayer · Global Daivadasakam Prayer",
    "DESCRIPTION:Global Daivadasakam prayer gathering conducted by Sree Narayana Forum for Universal Brotherhood, Germany (Chairman: Dr. Varun Radhakrishnan) on Sunday, 25 October 2026 at 7:00 PM IST.",
    "LOCATION:Global Livestream & Local Gathering Hubs Worldwide",
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "one-world-one-prayer-2026.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
